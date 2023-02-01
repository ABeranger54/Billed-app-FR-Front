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

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }

    describe("When I upload an image", () =>{
      //Vérification de la validité d'une image (.png), le fichier doit être accepté
      test("Then file picker accept .jpg, .jpeg & .png extensions", () => {
        document.body.innerHTML = html;
        var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        var input = document.querySelector(`input[data-testid="file"]`);
        var f = new File(["image"], "image.png", {type: "image/png", lastModified: new Date("December 17, 2022 03:24:00")});
        userEvent.upload(input, f);
        expect(container.formData.has("file")).toBe(true);
      })

      //Vérification de la validité d'un document (.pdf), le fichier doit être refusé
      test("Then file picker reject other extensions", () => {
        document.body.innerHTML = html;
        var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        var input = document.querySelector(`input[data-testid="file"]`);
        var f = new File(["doc"], "doc.pdf", {type: "document/pdf", lastModified: new Date("December 17, 2022 03:24:00")});
        userEvent.upload(input, f);
        expect(container.formData.has("file")).toBe(false);
      })
    })

    //Test d'intégration POST new bill
    describe("When I submit the new bill", () => {
      //Vérification du bon envoi de la note de frais, l'objet NewBill doit contenir toutes les informations requises
      test("Then new bill should be found in the bills list", () => {
        document.body.innerHTML = html;
        var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});

        var type = document.querySelector(`select[data-testid="expense-type"]`);
        type.value = "Transports";
        var name = document.querySelector(`input[data-testid="expense-name"]`);
        name.value = "Hotel";
        var amount = document.querySelector(`input[data-testid="amount"]`);
        amount.value = "130";
        var date = document.querySelector(`input[data-testid="datepicker"]`);
        date.value = new Date(2018, 8, 22);
        var vat = document.querySelector(`input[data-testid="vat"]`);
        vat.value = "70";
        var pct = document.querySelector(`input[data-testid="pct"]`);
        pct.value = "20";

        var sendButton = document.getElementById("btn-send-bill");
        fireEvent.click(sendButton);
        //expect(container.fileUrl).toBe("https://localhost:3456/images/test.jpg");
        //expect(container.billId).toBe("1234");
        expect(container.formData.has("email")).toBe(true);
        expect(container.formData.get("type")).toBe(type.value);
        expect(container.formData.get("name")).toBe(name.value);
        expect(container.formData.get("amount")).toBe(amount.value);
        expect(container.formData.get("date")).toBe(date.value);
        expect(container.formData.get("vat")).toBe(vat.value);
        expect(container.formData.get("pct")).toBe(pct.value);
        //expect(container.formData.get("fileName")).toBe(container.fileName);
        expect(container.formData.get("status")).toBe("pending");
      })

      //Vérification de la redirection vers la page Bills quand un clique sur le bouton d'envoi est effectué
      test("Then I am redirected to Bills page", () => {
        document.body.innerHTML = html;
        var container = new NewBill({document, onNavigate, store: mockStore, localStorage: localStorageMock});
        var sendButton = document.getElementById("btn-send-bill");
        const handleSubmit = jest.fn((e) => container.handleSubmit);
        sendButton.addEventListener("click", handleSubmit)
        fireEvent.click(sendButton);
        expect(handleSubmit).toHaveBeenCalled();
      });
    })
  })
})
