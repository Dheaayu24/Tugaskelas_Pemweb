const mobileButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileButton && mobileMenu) {
    mobileButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });
}


const homeSearch = document.querySelector("#homeSearch");

if (homeSearch) {
    homeSearch.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const keyword = homeSearch.value.trim();

            if (keyword !== "") {
                window.location.href =
                    "courses.html?search=" + encodeURIComponent(keyword);
            }

        }

    });
}


const courseSearch = document.querySelector("#courseSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const levelFilter = document.querySelector("#levelFilter");
const sortFilter = document.querySelector("#sortFilter");

const courseCards = document.querySelectorAll(".course-card");
const courseCount = document.querySelector("#courseCount");
const noResult = document.querySelector("#noResult");


function filterCourses() {

    const searchValue = courseSearch
        ? courseSearch.value.toLowerCase().trim()
        : "";

    const categoryValue = categoryFilter
        ? categoryFilter.value
        : "all";

    const levelValue = levelFilter
        ? levelFilter.value
        : "all";

    let visibleCourses = [];


    courseCards.forEach(function (card) {

        const title = card.dataset.title.toLowerCase();
        const category = card.dataset.category;
        const level = card.dataset.level;


        const matchSearch =
            title.includes(searchValue);

        const matchCategory =
            categoryValue === "all" ||
            category === categoryValue;

        const matchLevel =
            levelValue === "all" ||
            level === levelValue;


        if (matchSearch && matchCategory && matchLevel) {

            card.classList.remove("hidden");

            visibleCourses.push(card);

        } else {

            card.classList.add("hidden");

        }

    });


    // Update jumlah kursus
    if (courseCount) {

        courseCount.textContent =
            `Menampilkan ${visibleCourses.length} kursus`;

    }


    // Pesan jika tidak ditemukan
    if (noResult) {

        if (visibleCourses.length === 0) {
            noResult.classList.remove("hidden");
        } else {
            noResult.classList.add("hidden");
        }

    }

}


// Jalankan filter ketika mengetik
if (courseSearch) {
    courseSearch.addEventListener("input", filterCourses);
}


// Jalankan filter kategori
if (categoryFilter) {
    categoryFilter.addEventListener("change", filterCourses);
}


// Jalankan filter level
if (levelFilter) {
    levelFilter.addEventListener("change", filterCourses);
}



if (sortFilter) {

    sortFilter.addEventListener("change", function () {

        const courseContainer =
            document.querySelector("#courseContainer");

        if (!courseContainer) return;


        const cards = Array.from(
            courseContainer.querySelectorAll(".course-card")
        );


        if (sortFilter.value === "name") {

            cards.sort(function (a, b) {

                return a.dataset.title.localeCompare(
                    b.dataset.title
                );

            });

        }


        if (sortFilter.value === "rating") {

            cards.sort(function (a, b) {

                return Number(b.dataset.rating) -
                       Number(a.dataset.rating);

            });

        }


        if (sortFilter.value === "default") {

            cards.sort(function (a, b) {

                return Number(a.dataset.order) -
                       Number(b.dataset.order);

            });

        }


        cards.forEach(function (card) {

            courseContainer.appendChild(card);

        });

    });

}




const registerButtons =
    document.querySelectorAll(".register-button");


registerButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        alert(
            "Selamat datang di EduLearn! 🎓"
        );

    });

});

