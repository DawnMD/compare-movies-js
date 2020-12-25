let leftSide;
let rightSide;

const movieSelect = async ({ imdbID }, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "key",
      i: imdbID,
    },
  });

  summaryElement.innerHTML = movieDetail(response.data);

  if (side === "left") {
    leftSide = response.data;
  } else {
    rightSide = response.data;
  }

  if (leftSide && rightSide) {
    startCompare();
  }
};

const startCompare = () => {
  const leftSideStat = document.querySelectorAll("#left-summary .notification");
  const rightSideStat = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStat.forEach((left, index) => {
    const rightValue = parseInt(rightSideStat[index].dataset.value);
    const leftValue = parseInt(left.dataset.value);

    if (rightValue > leftValue) {
      left.classList.remove("is-primary");
      left.classList.add("is-warning");
    } else {
      rightSideStat[index].classList.remove("is-primary");
      rightSideStat[index].classList.add("is-warning");
    }
  });
};
const movieDetail = ({
  Poster,
  Title,
  Genre,
  Plot,
  Awards,
  BoxOffice,
  Metascore,
  imdbRating,
  imdbVotes,
}) => {
  const boxOffice = parseInt(BoxOffice.replace(/\$/g, "").replace(/\,/g, ""));
  const metascore = parseInt(Metascore);
  const imdb = parseFloat(imdbRating);
  const votes = parseInt(imdbVotes.replace(/,/g, ""));

  const prize = Awards.split(" ").reduce((count, word) => {
    if (isNaN(parseInt(word))) {
      return count;
    } else {
      return count + parseInt(word);
    }
  }, 0);
  return `
	<article class='media'>
		<figure class='media-left'>
			<p>
				<img src='${Poster}'/>
			</p>
		</figure>
		<div class='media-content'>
			<div class='content'>
				<h1>${Title}</h1>
				<h4>${Genre}</h4>
				<p>${Plot}</p>
			</div>
		</div>
	</article>
	<article data-value='${prize}' class='notification is-primary'>
		<p class='title'>${Awards}</p>
		<p class ='subtitle'>Awards</p>
	</article>
	<article data-value='${boxOffice}' class='notification is-primary'>
		<p class='title'>${BoxOffice}</p>
		<p class ='subtitle'>Box Office</p>
	</article>
	<article data-value='${metascore}' class='notification is-primary'>
		<p class='title'>${Metascore}</p>
		<p class ='subtitle'>Metascore</p>
	</article>
	<article data-value='${imdb}' class='notification is-primary'>
		<p class='title'>${imdbRating}</p>
		<p class ='subtitle'>IMDB Rating</p>
	</article>
	<article data-value='${votes}' class='notification is-primary'>
		<p class='title'>${imdbVotes}</p>
		<p class ='subtitle'>IMDB Votes</p>
	</article>
	`;
};

const autoCompleteConfig = {
  renderOption(item) {
    const imgSRC = item.Poster === "N/A" ? "" : item.Poster;
    return `
		<img src="${imgSRC}" />
		${item.Title} (${item.Year})
	`;
  },
  title(item) {
    return item.Title;
  },
  async fetchItems(name) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "key",
        s: name,
      },
    });
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

autocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onSelect(item) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    return movieSelect(item, document.querySelector("#left-summary"), "left");
  },
});

autocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onSelect(item) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    return movieSelect(item, document.querySelector("#right-summary"), "right");
  },
});
