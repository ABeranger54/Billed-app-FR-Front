import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    this.formData = new FormData();
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    e.preventDefault()
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    this.fileName = file.name;
    const ext = this.fileName.split('.')[1];

    if(this.formData.has("file")){
      this.formData.delete("file");
    }

    if(ext.toLowerCase() != "jpg" && ext.toLowerCase() != "png" && ext.toLowerCase() != "jpeg"){
      this.document.querySelector(`input[data-testid="file"]`).value = null;
      
    }else{
      this.formData.append('file', file)
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.formData.append("email", JSON.parse(localStorage.getItem("user")).email);
    this.formData.append("type", e.target.querySelector(`select[data-testid="expense-type"]`).value);
    this.formData.append('name', e.target.querySelector(`input[data-testid="expense-name"]`).value);
    this.formData.append('amount', parseInt(e.target.querySelector(`input[data-testid="amount"]`).value));
    this.formData.append('date', e.target.querySelector(`input[data-testid="datepicker"]`).value);
    this.formData.append("vat", e.target.querySelector(`input[data-testid="vat"]`).value);
    this.formData.append("pct", parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20);
    this.formData.append("commentary", e.target.querySelector(`textarea[data-testid="commentary"]`).value);
    this.formData.append("fileName", this.fileName);
    this.formData.append("status", 'pending');

    this.store.bills()
      .create({
        data: this.formData,
        headers: {
          noContentType: true
        }
      })
      .then(({fileUrl, key}) => {
        this.billId = key
        this.fileUrl = fileUrl
      }).catch(error => console.error(error))
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
  }
}