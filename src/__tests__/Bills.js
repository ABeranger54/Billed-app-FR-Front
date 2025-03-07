/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import BillsContainer from "../containers/Bills.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)
  router()

  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    })

    describe("When I click on icon eye", () => {
      //Vérification de l'affichage du document correspondant à la note de frais sélectionnée
      test("Then the associated document should be shown", async () => {
        var vals = await mockStore.bills().list();
        const html = BillsUI({data: vals});
        document.body.innerHTML = html;
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        var container = new BillsContainer({document, onNavigate, store: mockStore, localStorage: localStorageMock});

        //Le container n'existe pas par défaut
        var doc = container.document.querySelector(".bill-proof-container");
        expect(doc).toBe(null);

        $.fn.modal = jest.fn();
        var eye = screen.getAllByTestId('icon-eye')[0];
        eye.click();

        //Le container doit exister
        doc = container.document.querySelector(".bill-proof-container");
        expect(doc).toBeTruthy();
      });
    })

    //Test d'intégration: getBills()
    describe("When I request getBills()", () => {
      //Vérification de la validité de la liste retournée par getBills
      test("Then getBills is not empty", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        var container = new BillsContainer({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        var res = await container.getBills();
        expect(res.length).toBeGreaterThan(0);
      })

      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        const antiChrono = (a, b) => ((a > b) ? 1 : -1)
        const datesSorted = [...dates].sort(antiChrono)
        expect(dates).toEqual(datesSorted)
      })
  
      describe("When an error occurs on API", () => {
        beforeEach(() => {
          jest.spyOn(mockStore, "bills")
          Object.defineProperty(
              window,
              'localStorage',
              { value: localStorageMock }
          )
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: "e@e"
          }))
          const root = document.createElement("div")
          root.setAttribute("id", "root")
          document.body.appendChild(root)
          router()
        })
        test("fetches bills from an API and fails with 404 message error", async () => {
    
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 404"))
              }
            }})
          window.onNavigate(ROUTES_PATH.Bills)
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 404/)
          expect(message).toBeTruthy()
        })
    
        test("fetches messages from an API and fails with 500 message error", async () => {
    
          mockStore.bills.mockImplementationOnce(() => {
            return {
              list : () =>  {
                return Promise.reject(new Error("Erreur 500"))
              }
            }})
    
          window.onNavigate(ROUTES_PATH.Bills)
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy()
        })
      })
    })
  })
})
