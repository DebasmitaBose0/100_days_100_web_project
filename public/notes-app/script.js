const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const openCard = document.getElementById("openCard");
const closeModal = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");
const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const greeting = document.getElementById("greeting");

const notesStyle = document.createElement("style");
notesStyle.innerHTML = `
  .favorite-btn, .lock-btn {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .favorite-btn:hover, .lock-btn:hover {
    transform: scale(1.2) !important;
  }
  .star-svg {
    width: 22px;
    height: 22px;
    fill: rgba(255,255,255,0.22);
    transition: fill 0.3s, filter 0.3s;
  }
  body.light .star-svg {
    fill: rgba(0,0,0,0.18);
  }
  .star-svg.active {
    fill: #ffb800 !important;
    filter: drop-shadow(0 0 5px rgba(255, 184, 0, 0.8));
  }
  .lock-svg {
    width: 18px;
    height: 18px;
    fill: rgba(255,255,255,0.3);
    transition: fill 0.3s;
  }
  body.light .lock-svg {
    fill: rgba(0,0,0,0.25);
  }
  .lock-svg.active {
    fill: #ff4a6a !important;
  }
  .lock-badge {
    display: inline-flex !important;
    align-items: center;
    gap: 4px;
  }
  .lock-badge-svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
`;
document.head.appendChild(notesStyle);

let notes = JSON.parse(localStorage.getItem("notes")) || [];

/* GREETING */

function setGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.innerText = "Good Morning 👋";
  } else if (hour < 18) {
    greeting.innerText = "Good Afternoon 👋";
  } else {
    greeting.innerText = "Good Evening 👋";
  }
}

setGreeting();

/* OPEN */

openModal.addEventListener("click", () => {
  modal.classList.add("active");
});

// document.addEventListener("click", (e) => {

//   if(e.target.id === "openCard"){
//     modal.classList.add("active");
//   }

// });

document.addEventListener("click", (e) => {
  if (e.target.id === "openCard" || e.target.closest("#openCard")) {
    modal.classList.add("active");
  }
});

/* CLOSE */

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

/* SAVE */

// saveBtn.addEventListener("click", () => {

//   const title = document.getElementById("title").value;
//   const content = document.getElementById("content").value;
//   const tag = document.getElementById("tag").value;
//   const favorite = document.getElementById("favorite").checked;
//   const locked = document.getElementById("locked").checked;

//   if(title === "" || content === ""){
//     alert("Please fill all fields");
//     return;
//   }

//   const note = {
//     id: Date.now(),
//     title,
//     content,
//     tag,
//     favorite,
//     locked,
//     trash:false,
//     date:new Date().toLocaleDateString()
//   };

//   notes.push(note);

//   localStorage.setItem("notes", JSON.stringify(notes));

//   renderNotes();

//   modal.classList.remove("active");

//   document.getElementById("title").value = "";
//   document.getElementById("content").value = "";
//   document.getElementById("favorite").checked = false;
//   document.getElementById("locked").checked = false;

//   showToast();

// });

// saveBtn.addEventListener("click", () => {

//   const title = document.getElementById("title").value.trim();
//   const content = document.getElementById("content").value.trim();
//   const tag = document.getElementById("tag").value;

//   const favorite =
//     document.getElementById("favorite").checked;

//   const locked =
//     document.getElementById("locked").checked;

//   if(title === "" || content === ""){
//     alert("Please fill all fields");
//     return;
//   }

//   const note = {
//     id: Date.now(),
//     title,
//     content,
//     tag,
//     favorite,
//     locked,
//     trash:false,
//     date:new Date().toLocaleDateString()
//   };

//   notes.push(note);

//   localStorage.setItem(
//     "notes",
//     JSON.stringify(notes)
//   );

//   renderNotes(currentView);

//   modal.classList.remove("active");

//   document.getElementById("title").value = "";
//   document.getElementById("content").value = "";

//   document.getElementById("tag").selectedIndex = 0;

//   document.getElementById("favorite").checked = false;
//   document.getElementById("locked").checked = false;

//   showToast();

// });

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value.trim();

  const content = document.getElementById("content").value.trim();

  const tag = document.getElementById("tag").value;

  if (title === "" || content === "") {
    alert("Please fill all fields");
    return;
  }

  const note = {
    id: Date.now(),
    title,
    content,
    tag,
    favorite: false,
    locked: false,
    trash: false,
    date: new Date().toLocaleDateString(),
  };

  notes.push(note);

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);

  modal.classList.remove("active");

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("tag").selectedIndex = 0;

  showToast();
});
/* RENDER */

function renderNotes(type = "all") {
  notesGrid.innerHTML = `
    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>
  `;

  let filtered = notes;

  if (type === "favorites") {
    filtered = notes.filter((note) => note.favorite);
  }

  if (type === "locked") {
    filtered = notes.filter((note) => note.locked);
  }

  if (type === "trash") {
    filtered = notes.filter((note) => note.trash);
  }

  filtered.forEach((note) => {
    if (type !== "trash" && note.trash) {
      return;
    }

    notesGrid.innerHTML += `

      <div class="card">

        ${note.locked ? `<div class="lock-badge"><svg class="lock-badge-svg" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> Locked</div>` : ""}

        <button
          class="favorite-btn"
          onclick="toggleFavorite(${note.id})"
        >
          ${note.favorite ? `<svg class="star-svg active" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>` : `<svg class="star-svg" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.37L12 6.1l1.71 4.04 4.38.37-3.32 2.88 1 4.28L12 15.4z"/></svg>`}
        </button>


        <button
            class="lock-btn"
            onclick="toggleLock(${note.id})"
         >
        ${note.locked ? `<svg class="lock-svg active" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>` : `<svg class="lock-svg" viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>`}
        </button>

        <h2>${note.title}</h2>

        <p>
${note.locked && currentView !== "locked" ? "🔒 Locked Note" : note.content}
</p>

        <div class="badge">${note.tag}</div>

        

       ${
         type === "trash"
           ? `
  <div class="card-footer">

      <div class="date">
          ${note.date}
      </div>

      <div class="trash-actions">

          <button
              class="restore-btn"
              onclick="restoreNote(${note.id})"
          >
              Restore
          </button>

          <button
              class="delete-btn"
              onclick="deleteForever(${note.id})"
          >
              Delete
          </button>

      </div>

  </div>
  `
           : `
  <div class="card-footer">

      <div class="date">
          ${note.date}
      </div>

      <button
          class="delete-btn"
          onclick="moveToTrash(${note.id})"
      >
          Trash
      </button>

  </div>
  `
       }

      </div>
    `;
  });

  //   noteCount.innerText = `You have ${filtered.length} notes`;
  noteCount.innerText = `You have ${
    filtered.filter((n) => !n.trash).length
  } notes`;
}

/* FAVORITE */

function toggleFavorite(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.favorite = !note.favorite;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}

function toggleLock(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.locked = !note.locked;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}

/* TRASH */

function moveToTrash(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.trash = true;
    }

    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(currentView);
}
function restoreNote(id) {
  notes = notes.map((note) => {
    if (note.id === id) {
      note.trash = false;
    }
    return note;
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes("trash");
}

/* DELETE */

function deleteForever(id) {
  notes = notes.filter((note) => note.id !== id);

  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes("trash");
}

/* SEARCH */
searchInput.addEventListener("keyup", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = notes.filter(
    (note) =>
      !note.trash &&
      (note.title.toLowerCase().includes(value) ||
        note.content.toLowerCase().includes(value) ||
        note.tag.toLowerCase().includes(value)),
  );

  notesGrid.innerHTML = `

    <div class="card add-card" id="openCard">
      <div class="plus">+</div>
      <h2>Add New Note</h2>
    </div>

  `;

  filtered.forEach((note) => {
    notesGrid.innerHTML += `

      <div class="card">

        ${note.locked ? `<div class="lock-badge"><svg class="lock-badge-svg" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> Locked</div>` : ""}

        <button
          class="favorite-btn"
          onclick="toggleFavorite(${note.id})"
        >
          ${note.favorite ? `<svg class="star-svg active" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>` : `<svg class="star-svg" viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.37L12 6.1l1.71 4.04 4.38.37-3.32 2.88 1 4.28L12 15.4z"/></svg>`}
        </button>

        <h2>${note.title}</h2>

        <p>${note.content}</p>

        <div class="badge">${note.tag}</div>

      </div>

    `;
  });
});
// searchInput.addEventListener("keyup", () => {

//   const value = searchInput.value.toLowerCase();

//   const filtered = notes.filter(note =>

//     !note.trash &&

//     (
//       note.title.toLowerCase().includes(value)
//       ||
//       note.content.toLowerCase().includes(value)
//       ||
//       note.tag.toLowerCase().includes(value)
//     )

//   );

//   notesGrid.innerHTML = "";

//   filtered.forEach(note => {

//     notesGrid.innerHTML += `
//       <div class="card">
//         <h2>${note.title}</h2>
//         <p>${note.content}</p>
//         <div class="badge">${note.tag}</div>
//       </div>
//     `;
//   });

// });

/* TOAST */

function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* DARK MODE */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const themeText = document.getElementById("themeText");

  if (document.body.classList.contains("light")) {
    themeText.innerHTML = "☀️ Light Mode";
  } else {
    themeText.innerHTML = "🌙 Dark Mode";
  }
});

/* MENU */

let currentView = "all";

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));

    item.classList.add("active");

    currentView = item.dataset.filter;

    renderNotes(currentView);
  });
});

/* START */

renderNotes();
