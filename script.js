const toggleBtn = document.getElementById("modeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // update button text
    if (document.body.classList.contains("dark")) {
        toggleBtn.textContent = "Light Mode";
    } else {
        toggleBtn.textContent = "Dark Mode";
    }
});

    const sliceLayer = document.getElementById("slice-layer");
    const slices = sliceLayer.querySelectorAll(".slice");

    slices.forEach((p, index) => {
        p.dataset.originalIndex = index;

        p.addEventListener("mouseenter", () => {
            sliceLayer.appendChild(p); // move to top of slice group ONLY
        });

        p.addEventListener("mouseleave", () => {
            const idx = Number(p.dataset.originalIndex);
            sliceLayer.insertBefore(p, sliceLayer.children[idx]);
        });
    });


    const topics = [
    {
        title: "Topic One",
        text: "f",
        image: "images/topic1.jpg"
    },
    {
        title: "Topic Two",
        text:`
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.

This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.This is a long paragraph about topic 3.

You can write multiple lines,
use spacing,
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
and keep your formatting exactly the way you type it.

Perfect for long text content.
`,

        image: "images/topic2.png"
    },
    {
        title: "Topic Three",
        text: "More detailed info for topic 3.",
        image: "images/topic3.jpeg"
    },
    {
        title: "Topic Four",
        text: "Everything about topic 4.",
        image: "images/topic4.jpg"
    },
    {
        title: "Topic Five",
        text: "Final topic’s information.",
        image: "images/topic5.png"
    }
];

const buttons = document.querySelectorAll(".slice");
const contentBox = document.getElementById("contentBox");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const index = btn.dataset.id;
        const data = topics[index];

        contentBox.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.text}</p>
            <img src="${data.image}" style="max-width: 300px;">
        `;

        // highlight selected button
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});
