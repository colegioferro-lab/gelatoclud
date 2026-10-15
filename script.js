const flavors=[
{id:1,name:"Fresa Silvestre",category:"Frutales",price:6500,tag:"FAVORITO",desc:"Fresa · Fruta natural",number:"01",image:"https://images.unsplash.com/photo- Strawberry"},
{id:2,name:"Chocolate Intenso",category:"Cremosos",price:7000,tag:"CLÁSICO",desc:"Cacao · Cremoso",number:"02",image:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=850&q=85"},
{id:3,name:"Pistacho Real",category:"Especiales",price:8500,tag:"PREMIUM",desc:"Pistacho · Notas tostadas",number:"03",image:"https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=850&q=85"},
{id:4,name:"Mango Tropical",category:"Frutales",price:6500,tag:"FRUTAL",desc:"Mango · Dulce y fresco",number:"04",image:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=850&q=85"},
{id:5,name:"Vainilla de Casa",category:"Cremosos",price:6000,tag:"",desc:"Vainilla · Suave",number:"05",image:"https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=850&q=85"},
{id:6,name:"Frutos del Bosque",category:"Frutales",price:7000,tag:"",desc:"Mora · Arándanos",number:"06",image:"https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=850&q=85"},
{id:7,name:"Caramelo Salado",category:"Especiales",price:8000,tag:"MÁS PEDIDO",desc:"Caramelo · Toque de sal",number:"07",image:"https://images.unsplash.com/photo-1517093157656-b9ec512f3170?auto=format&fit=crop&w=850&q=85"},
{id:8,name:"Limón Fresco",category:"Frutales",price:6000,tag:"REFRESCANTE",desc:"Limón · Cítrico",number:"08",image:"https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=850&q=85"}
];
// Sustituye cualquier URL de ejemplo incorrecta por una fotografía válida.
flavors[0].image="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=850&q=85";
const $=s=>document.querySelector(s);
let filter="Todos",cart=JSON.parse(localStorage.getItem("gelatoClubCart")||"[]"),toastTimer;
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n);

function renderFlavors(){
 const q=$("#searchInput").value.trim().toLocaleLowerCase("es");
 const shown=flavors.filter(f=>(filter==="Todos"||f.category===filter)&&`${f.name} ${f.category} ${f.desc}`.toLocaleLowerCase("es").includes(q));
 $("#flavorGrid").innerHTML=shown.map(f=>`<article class="flavor-card"><div class="flavor-photo"><img src="${f.image}" alt="Helado sabor ${f.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/700x900/f4e8de/352523?text=Gelato+Club'"><span class="flavor-index">${f.number}</span>${f.tag?`<span class="flavor-tag">${f.tag}</span>`:""}<button class="add-button" data-add="${f.id}">AÑADIR A MI PEDIDO ＋</button></div><div class="flavor-info"><div><h3>${f.name}</h3><p>${f.desc.toUpperCase()}</p></div><span class="price">${money(f.price)}</span></div></article>`).join("");
 $("#emptyMessage").hidden=shown.length>0;
}
function saveCart(){localStorage.setItem("gelatoClubCart",JSON.stringify(cart));renderCart()}
function add(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();toast("AÑADIDO: "+flavors.find(f=>f.id===id).name)}
function renderCart(){
 $("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
 $("#cartTotal").textContent=money(cart.reduce((n,x)=>n+(flavors.find(f=>f.id===x.id)?.price||0)*x.qty,0));
 $("#cartItems").innerHTML=cart.length?cart.map(x=>{const f=flavors.find(y=>y.id===x.id);if(!f)return"";return`<article class="cart-item"><img src="${f.image}" alt=""><div><h3>${f.name}</h3><p>${money(f.price)}</p><div class="quantity"><button data-qty="${f.id}" data-step="-1" aria-label="Restar">−</button><span>${x.qty}</span><button data-qty="${f.id}" data-step="1" aria-label="Sumar">＋</button></div></div><button class="remove" data-remove="${f.id}" aria-label="Eliminar">✕</button></article>`}).join(""):"<p>Tu pedido está vacío. ¡Vamos por algo dulce!</p>";
}
function openCart(){$("#cart").classList.add("open");$("#overlay").classList.add("open");$("#cart").setAttribute("aria-hidden","false");document.body.classList.add("locked")}
function closeCart(){$("#cart").classList.remove("open");$("#overlay").classList.remove("open");$("#cart").setAttribute("aria-hidden","true");document.body.classList.remove("locked")}
function toast(text){$("#toast").textContent=text;$("#toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("#toast").classList.remove("show"),2300)}
$("#flavorGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)add(Number(b.dataset.add))});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const item=cart.find(x=>x.id===Number(q.dataset.qty));if(item)item.qty+=Number(q.dataset.step);cart=cart.filter(x=>x.qty>0);saveCart()}if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));saveCart()}});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderFlavors()}));
$("#searchInput").addEventListener("input",renderFlavors);$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("#checkout").addEventListener("click",()=>toast(cart.length?"DEMO: NO SE HA ENVIADO NINGÚN PEDIDO":"¡AGREGA UN SABOR A TU PEDIDO!"));
$("#menuToggle").addEventListener("click",e=>{const open=$("#nav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(open))});
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>{$("#nav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
$("#year").textContent=new Date().getFullYear();

// Efecto parallax con movimiento reducido desactivado por accesibilidad.
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let pending=false;
function parallaxUpdate(){document.querySelectorAll(".parallax").forEach(layer=>{const rect=layer.parentElement.getBoundingClientRect();const y=(rect.top+rect.height/2-window.innerHeight/2)*-Number(layer.dataset.speed||.15);layer.style.setProperty("--parallax-y",`${y.toFixed(1)}px`)});pending=false}
if(!reduced){parallaxUpdate();window.addEventListener("scroll",()=>{if(!pending){requestAnimationFrame(parallaxUpdate);pending=true}},{passive:true});window.addEventListener("resize",parallaxUpdate)}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
renderFlavors();renderCart();
