function sendMail(contactForm) {
    emailjs.init("user_14ThDT8PZWRz451fQIwWN");
    emailjs.send("gmail", "rosie", {
            "from_name": contactForm.name.value,
            "from_email": contactForm.emailaddress.value,
            "project_request": contactForm.projectsummary.value
        })
        .then(
            function (response) {
                alert("SUCCESS", response);
            },
            function (error) {
                alert("ERROR", error);
            }
        );
        return false;
};


function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: {
            lat: 46.619261,
            lng: -33.134766
        }
    });

    var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var locations = [{
            lat: 40.758091,
            lng: -73.968285
        },
        {
            lat: 41.084045,
            lng: -73.874245
        },
        {
            lat: 40.754932,
            lng: -73.984016
        }
    ];

    var markers = locations.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });

    var markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}

function userInformationHTML(user) {
    return `
        <h3>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url} target="_blank">${user.login}</a>)
            </span>
        </h3>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url} target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}">
                </a>
            </div>
            <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function (repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h3>Please enter a GitHub username</h3>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/images/loader.gif" alt="Loading...">
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}?client_id=015ceeabd368e1783558&client_secret=3db03bc078ca735ef00071498bf9591057bbd418`),
        $.getJSON(`https://api.github.com/users/${username}/repos?client_id=015ceeabd368e1783558&client_secret=3db03bc078ca735ef00071498bf9591057bbd418`)
    ).then(
        function (firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function (errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h3>No info found for ${username}</h3>`);
            } else if (errorResponse.status === 403) {
                var reseTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${reseTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h3>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

$(document).ready(fetchGitHubInformation);