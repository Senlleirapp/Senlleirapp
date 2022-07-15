export const routes = [
  {
    path: "/",
    name: "inicio",
    component: () => import("../views/Inicio.vue"),
  },
  {
    path: "/nova-arbore",
    name: "NuevoArbol",
    component: () => import("@/views/senlleira/NuevoArbol.vue"),
  },
  {
    path: "/catalogo",
    name: "catalogo",
    component: () => import("@/views/senlleira/CatalogoArboresView.vue"),
  },
  {
    path: "/catalogo-senlleiras",
    name: "CatalogoSenlleiras",
    component: () => import("@/views/senlleira/CatalogoSenlleirasView.vue"),
  },
  // {
  //   path: "/mapaParques",
  //   name: "MapaParques",
  //   component: () => import("@/views/parques/MapaParques.vue"),
  // },
  
  // {
  //   path: "/mapaSenlleiras",
  //   name: "MapaSenlleiras",
  //   component: () => import("@/views/senlleira/MapaSenlleiras.vue"),
  // },
  {
    path: "/mapa-parques",
    name: "MapaParques",
    component: () => import("@/views/parques/ParkMapView.vue"),
  },
  {
    path: "/mapa-senlleiras",
    name: "MapaSenlleiras",
    component: () => import("@/views/senlleira/SenlleiraMapView.vue"),
  },
  
  // ADMIN
  {
    path: "/admin",
    name: "administrador",
    component: () => import("@/components/admin/LoginAdmin.vue"),
  },
  {
    path: "/admin-especies",
    name: "admin-especies",
    meta: {
      requiereAuth: true,
    },
    component: () => import("@/views/admin/CatalogoEspecies.vue"),
  },
  {
    path: "/admin-senlleira",
    name: "admin-senlleira",
    meta: {
      requiereAuth: true,
    },
    component: () => import("@/views/admin/CatalogoSenlleiras.vue"),
  },
  {
    path: "/admin-parque",
    name: "admin-parque",
    component: () => import("@/views/admin/CatalogoParques.vue"),
  },
  // test
  {
    path: "/catalogo-de-especies",
    name: "CatalogoDeEspecies",
    component: () => import("@/views/especies/CatalogoEspecies.vue"),
  },
  {
    path: "/busqueda",
    name: "Busqueda",
    component: () => import("@/components/busqueda/Busqueda.vue"),
  },
  {
    path: "/catalogo-de-parques",
    name: "CatalogoDeParques",
    component: () => import("@/views/parques/CatalogoParques.vue"),
  },
  {
    path: "/ficha-parque/:idDoc",
    name: "FichaParque",
    component: () => import("@/views/parques/FichaParqueView.vue"),
  },
  {
    path: "/ficha-tecnica/:idDoc",
    name: "FichaSenlleira",
    component: () => import("@/views/senlleira/FichaSenlleiraView.vue"),
  },
  {
    path: "/prueba",
    name: "prueba",
    component: () => import("@/views/PruebasView.vue"),
  }

];
