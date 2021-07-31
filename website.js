
"use strict";
class githubuser {
  constructor(options = {}) {
    this.options = {
      container: "",
    };
    Object.assign(this.options, options); 
    this.url = "https://api.github.com";
    this.user = "/users/:username/repos";
    this.elements = {};
    this.projectspage();
  }
  projectspage() {
    this.elements.container = document.querySelector(this.options.container);
    this.elements.container.innerHTML = this.page();
    this.elements.form = this.elements.container.querySelector(".form");
    this.elements.input = this.elements.container.querySelector(".inputText");
    this.elements.list = this.elements.container.querySelector(".repositories");

    this.userinput();
  }
  page() {
    return `
      <form class="form" style="display:flex;justify-content:center;">
        <label style="font-size:40px;">Github User</label>
        <input type="text" style="height:50px;width:200px;font-size:20px;"class="inputText" placeholder="user">
        <input style="height:50px;width:800px;font-size:30px;" type="submit" value="search for user projects"/>
      </form>
      <div class="repositories"></div>
  `;
  }
  userpage(repositories) {
    return `
      <div>
        ${repositories
          .map(repository => this.userspage(repository))
          .join("")}
      </div>
    `;
  }
  userprojectsinfo(repositoryData) {
    const repositories = repositoryData.map(repository => {
      const {name,description,html_url: url,created_at: created,language,} = repository;

      return {
        description: description ? description : "There is no description",
        name: name,
        url: url,
        createdAt: created,
        language: language ? language : "no language",
      };
    });
    return repositories;
  }

  
  userspage(repository) {
    const { url, name, createdAt, description, language } = repository;
    return `
        <a href="${url}" target="_blank" >
            <h4>${name}</h4>
            <small>${createdAt}</small>
          <p>
            ${description}
          </p>
          <p>Language in respository: ${language}</p>
        </a>
      `;
  }

  userinput() {
    this.elements.form.addEventListener("submit", e => {
      e.preventDefault();
      const username = this.elements.input.value.trim();

      this.userprojects(username, repositories => {
        repositories = this.userprojectsinfo(repositories);
        const markup = this.userpage(repositories);
        this.elements.list.innerHTML = markup;
      });
    });
  }

  async userprojects(username, callback) {
    const url = `${this.url}${this.user}`.replace(":username",encodeURIComponent(username));
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    callback(data);
  }
}

 widget = new githubuser({ container: ".result" });
