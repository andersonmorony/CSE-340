const form = document.querySelector("#form-classification")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })