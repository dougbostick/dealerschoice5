console.log("whatttup son");

const ul = document.querySelector("ul");
const menu = document.querySelector("#menu");
const customers = document.querySelector("#customers");
const customer = document.querySelector("#customer");

menu.addEventListener("click", (ev) => {
  if (ev.target.id === "menu") {
    //console.log(ev);
    getTacos();
  }
});

customers.addEventListener("click", (ev) => {
  if (ev.target.id === "customers") {
    //console.log(ev.target);
    getCustomers();
  }
});

ul.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "LI") {
    const id = ev.target.getAttribute("data-id");
    await axios.delete(`/tacomenu/${id}`);
    getTacos();
    //console.log(id);
  }
});

// customer.addEventListener("click", (ev) => {
//   if (ev.target.id === "customer") {
//     console.log(ev.target);
//     //const id = ev.target.getAttribute("data-id");
//     //getOrderHistory(id);
//   }
// });

const getTacos = async () => {
  const response = await axios.get("/tacomenu");
  const tacos = response.data;
  const html = tacos
    .map((taco) => {
      return `
      <li data-id='${taco.id}'>${taco.name}  -->   $${taco.price}</li>
      `;
    })
    .join("");
  ul.innerHTML = html;
};

const getCustomers = async () => {
  const response = await axios.get("/customers");
  const tacos = response.data;
  const html = tacos
    // data-id='${customer.id}'
    .map((customer) => {
      return `
        <li id="customer" >${customer.name}</li>
        `;
    })
    .join("");
  ul.innerHTML = html;
};

// const getOderHistory = async (id) => {
//   const response = await axios.get(`/orderHistory/:${id}`);
//   const orders = response.data;
//   const html = orders.map((order) => {
//     return `
//       <li>${order.tacoMenuId}</li>
//       `;
//   });
// };
//   const init = async () => {
//     const response = await axios.get("/tacomenu");
//     const tacos = response.data;
//     const html = tacos
//       .map((taco) => {
//         return `
//         <li>${taco.name}</li>
//         `;
//       })
//       .join("");
//     ul.innerHTML = html;
//   };
// init();
