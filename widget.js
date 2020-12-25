const autocomplete = ({ root, renderOption, onSelect, title, fetchItems }) => {
	root.innerHTML = `
        <label><strong>Search</strong></label>
        <input class='input'>
        <div class="dropdown">
            <div class='dropdown-menu'>
                <div class='dropdown-content results'>
                </div>
            </div>
        </div>
    `;
	const delaySearch = async (e) => {
		const items = await fetchItems(e.target.value);
		if (!items.length) {
			dropdown.classList.remove("is-active");
			return;
		}
		dropdown.classList.add("is-active");
		results.innerHTML = "";
		for (const item of items) {
			const anchorOption = document.createElement("a");

			anchorOption.classList.add("dropdown-item");
			anchorOption.innerHTML = renderOption(item);
			anchorOption.addEventListener("click", () => {
				dropdown.classList.remove("is-active");
				input.value = title(item);
				onSelect(item);
			});
			results.appendChild(anchorOption);
		}
	};
	const dropdown = root.querySelector(".dropdown");
	const results = root.querySelector(".results");
	const input = root.querySelector("input");

	input.addEventListener("input", debounce(delaySearch));

	document.addEventListener("click", (e) => {
		if (!root.contains(e.target)) {
			dropdown.classList.remove("is-active");
		}
	});
};
