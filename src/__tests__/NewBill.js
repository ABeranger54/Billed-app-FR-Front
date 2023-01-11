/**
 * @jest-environment jsdom
 */
import store from "../app/Store.js"
import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    var container = new NewBill({document, onNavigate, store, localStorage});

    describe("When I submit the new bill", () => {
      test("Then new bill should be found the bills list", () => {
          //console.log(container.billId);
          //var b = store.bills().select(container.billId);
          //console.log(b);
          //expect(true).toBe(true);
      })
    })
    describe("When I upload an image", () =>{
      test("Then file picker only accept .jpg, .jpeg & .png extensions", () => {
        var f = new File([""], "image.png", {type: "image/png", lastModified: new Date("December 17, 2022 03:24:00")});
        //document.querySelector(`input[data-testid="file"]`).files[0] = f;
        //var file = document.querySelector(`input[data-testid="file"]`).files[0];
        //console.log(file);
        //container.handleChangeFile();
        //expect(true).toBe(true);
      })
    })
  })
})
