const modalBtn = document.querySelector(".btn-modal");
const modalClose = document.querySelector(".modal__icon");
const modal = document.querySelector(".modal-overlay");

modalBtn.addEventListener("click", () => {
   document.body.classList.add("modal-is-open");
});

modalClose.addEventListener("click", () => {
   document.body.classList.remove("modal-is-open");
});

document.body.addEventListener("keydown", (e) => {
   if (e.keyCode === 27) {
      document.body.classList.remove("modal-is-open");
   }
});

// close modal when click outside
modal.addEventListener("click", (e) => {
   if (!e.target.closest(".modal")) {
      document.body.classList.remove("modal-is-open");
   }
});
