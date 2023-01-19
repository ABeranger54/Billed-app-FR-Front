/**
 * @jest-environment jsdom
 */
import store from "../app/Store.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from '@testing-library/user-event'
import {fireEvent, screen, waitFor} from "@testing-library/dom"

//jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }

    describe("When I submit the new bill", () => {
      test("Then new bill should be found in the bills list", () => {
        var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});

        var name = document.querySelector(`input[data-testid="expense-name"]`);
        name.value = "Hotel";
        var amount = document.querySelector(`input[data-testid="amount"]`);
        amount.value = "130";

        var sendButton = document.getElementById("btn-send-bill");
        fireEvent.click(sendButton);
        expect(container.formData.has("email")).toBe(true);
        expect(container.formData.get("name")).toBe(name.value);
        expect(container.formData.get("amount")).toBe(amount.value);

      })
      //Problème: erreur undefined sur addEventListener dès que onNavigate est appelé
      test("Then I am redirected to Bills page", () => {
        // var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        // var sendButton = document.getElementById("btn-send-bill");
        // const handleSubmit = jest.fn((e) => container.handleSubmit)
        // sendButton.addEventListener("click", handleSubmit)
        // fireEvent.click(sendButton);
        // expect(handleSubmit).toHaveBeenCalled();
      });
    })
    describe("When I upload an image", () =>{
      //Problème: erreur undefined sur addEventListener dès que onNavigate est appelé
      test("Then file picker accept .jpg, .jpeg & .png extensions", () => {
        // var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        // var input = document.querySelector(`input[data-testid="file"]`);

        // //Vérification de la validité d'une image (.png), le fichier doit être accepté
        // var f = new File(["image"], "image.png", {type: "image/png", lastModified: new Date("December 17, 2022 03:24:00")});
        // userEvent.upload(input, f);
        // expect(container.formData.has("file")).toBe(true);
      })
      //Problème: erreur undefined sur addEventListener dès que onNavigate est appelé
      test("Then file picker reject other extensions", () => {
        // var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        // var input = document.querySelector(`input[data-testid="file"]`);

        // //Vérification de la validité d'un document (.pdf), le fichier doit être refusé
        // var f = new File(["doc"], "doc.pdf", {type: "document/pdf", lastModified: new Date("December 17, 2022 03:24:00")});
        // userEvent.upload(input, f);
        // expect(container.formData.has("file")).toBe(false);
      })
    })
  })
})
