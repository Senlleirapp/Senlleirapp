<template>
  <table class="tabla_datos_administrativo">
    <tr class="header_administrativo">
      <td>Orden</td>
      <td>Nome</td>
      <td>Localización</td>
      <td>Xeolocalización</td>
      <td class="tabla_administrativo_options">
        <span>
          <icono :icon="['fa', 'gears']"></icono>
        </span>
      </td>
    </tr>

    <tr
      class="catalogo_administrativo"
      v-for="(parque, index) in storeParques.parques"
      :key="index"
    >
      <td>{{ parque.orden }}</td>
      <td>{{ parque.nombre }}</td>
      <td>{{ parque.localizacion }}</td>
      <td>{{ parque.lat }},{{ parque.lng }}</td>

      <td class="tabla_administrativo_options">
        <span>
          <icono
            :icon="['fa', 'trash']"
            @click="handleDelete({ id: parque.idDoc, name: parque.nombre })"
          >
          </icono>

          <icono
            @click="editar(parque)"
            :icon="['fa', 'pen']"
            to="/arb-:id"
          ></icono>
          <router-link
            class="asign-specie"
            :to="{
              name: 'AdminParqueEspecies',
              params: {
                idDoc: parque.idDoc,
              },
            }"
          >
            Asignar Especies
          </router-link>
        </span>
      </td>
    </tr>
  </table>
  <!-- Alerta para eliminar parque -->
  <div v-if="mostrar" class="alerta_container">
    <div class="alerta_borrar_especie">
      <h2>Atención</h2>
      <span class="borrar_txt">
        <icono :icon="['fa', 'circle-exclamation']"></icono>
        <p>Eliminarase {{ nombre }} de maneira irrevesible</p>
      </span>
      <span class="borrar_btn">
        <button @click="borrarParque">Eliminar</button>
        <button @click="mostrar = false">Cancelar</button>
      </span>
    </div>
  </div>
  <!-- Modulo para editar -->

  <div class="form-container" v-if="parque">
    <form id="parques" @submit.prevent="cambiarDatos(`${parque.idDoc}`)">
      <icono
        class="close-form"
        :icon="['fa', 'xmark']"
        @click="parque = null"
      ></icono>
      <fieldset class="data_especies">
        <h2>Editar Parques</h2>
        <label for="orden" class="form-label" required>Orden</label>
        <input
          type="number"
          v-model="parque.orden"
          id="orden"
          placeholder="Orden"
        />
        <label for="nombre" class="form-label" required>Nome</label>
        <input
          type="text"
          v-model="parque.nombre"
          id="nombre"
          placeholder="Nome"
        />
        <label for="tipoloxia" class="form-label">Tipoloxía</label>
        <input
          type="text"
          v-model="parque.tipoloxia"
          id="tipoloxia"
          placeholder="Tipoloxia"
        />
        <label for="localización" class="form-label">Localización</label>
        <input
          type="text"
          v-model="parque.localizacion"
          id="localizacion"
          placeholder="Localización"
        />
        <label for="lat" class="form-label">Latitude</label>
        <input
          type="number"
          step="any"
          v-model="parque.lat"
          id="latitud"
          placeholder="Latitud"
        />
        <label for="lng" class="form-label">Lonxitude</label>
        <input
          type="number"
          step="any"
          v-model="parque.lng"
          id="lng"
          placeholder="Longitud"
        />

        <label for="carballeira" class="form-label">Carballeira</label>
        <input
          class="input-parque"
          v-model="parque.carballeira"
          type="checkbox"
          name="carballeira"
          id="carballeira"
        />
        <label for="cronoloxia" class="form-label">Cronoloxía</label>
        <input
          type="text"
          v-model="parque.cronoloxia"
          id="cronoloxia"
          placeholder="Cronoloxía"
        />
        <label for="superficie" class="form-label">Superficie</label>
        <input
          type="text"
          v-model="parque.superficie"
          id="superficie"
          placeholder="Superficie"
        />
        <label for="descripcion" class="form-label">Descrición</label>
        <textarea
          type="text"
          v-model="parque.descripcion"
          cols="50"
          rows="20"
          id="descripcion"
          placeholder="Descripción"
        ></textarea>

        <fieldset class="editar-images">
          <div class="images" v-for="image of images" :key="image.ref">
            <img class="image" :src="image.src" alt="" />
            <button class="btn-eliminar" @click="deleteImage(image.ref)">
              Eliminar
            </button>

            <input
              v-model="portada"
              name="portada"
              :value="image.ref"
              type="radio"
            />
            Portada
          </div>
        </fieldset>
        <div>Fotos do parque</div>
        <theUploader @emitirFichero="gestionFoto"></theUploader>
        <div>Mapa do parque</div>
        <TheUploader @emitirFichero="gestionMapa"></TheUploader>

        <input
          type="submit"
          value="Editar Parque"
          :disabled="parque === null"
        />
        <div v-if="loading">Gardando...</div>
      </fieldset>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "@/assets/css/admin-css/catalogoAdmin.css";
import "@/assets/css/admin-css/cargarEspecies.css";
import TheUploader from "@/components/TheUploader.vue";
import { useStoreParques } from "../../../stores/parques";
import { updateDocument } from "../../../hook/firestore.hook";
import { listAllRef, getDownURL } from "../../../hook/storage.hook";

const storeParques = useStoreParques();
storeParques.setParques().catch((error) => console.log(error));

const nombre = ref("");
const loading = ref(false);
const portada = ref("");
let itemDelete = null;

const mostrar = ref(false);

// FUNCION PARA ELIMINAR PARQUE
const handleDelete = ({ id, name }) => {
  itemDelete = id;
  nombre.value = name;
  mostrar.value = true;
};

const borrarParque = async () => {
  if (itemDelete) {
    await storeParques.borrarParque(itemDelete);
    mostrar.value = false;
  }
};

// FUNCION PARA EDITAR PARQUE

const parque = ref(null);
const editar = async (par) => {
  const refs = await listAllRef(`parques/${par.idDoc}`);
  const list = await listAllRef(`parquesficha/${par.idDoc}`);

  images.value = [];
  refs.forEach(async (ref) => {
    images.value.push({
      ref,
      src: await getDownURL(ref),
    });
  });
  list.forEach(async (ref) => {
    images.value.push({
      ref,
      src: await getDownURL(ref),
    });
  });

  parque.value = par;
};
const cambiarDatos = async (id) => {
  const docRef = await updateDocument(id, "Parques", parque.value);
  try {
    loading.value = true;
    if (portada.value.length) parque.value.urlficha = portada.value;
    await updateDocument(id, "Parques", parque.value);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
  parque.value = null;
};

const error = ref(false);

const gestionFoto = async (file) => {
  if (file) {
    for (let i = 0, tam = file.length; i < tam; i++) {
      const imagen = file[i];
      try {
        error.value = "";
        await storeParques.subirParque({
          ref: `parques/${parque.value.idDoc}`,
          file: imagen,
        });
      } catch (e) {
        console.log(e);
        error.value = e.mensage;
      }
    }
  }
};

const gestionMapa = async (file) => {
  if (file) {
    for (let i = 0, tam = file.length; i < tam; i++) {
      const imagen = file[i];
      try {
        error.value = "";
        await storeParques.subirParque({
          ref: `parquesficha/${parque.value.idDoc}`,
          file: imagen,
        });
      } catch (e) {
        console.log(e);
        error.value = e.mensage;
      }
    }
  }
};

//Eliminar la imagen en el modulo de editar

const deleteImage = (ref) => {
  const texto = prompt(`para eliminar a foto confirme a referencia:${ref}`);
  if (texto === ref) {
    storeParques.borrarFoto(ref);
  }
};

const images = ref([]);

const cargarFotos = async () => {
  try {
    error.value = "";
    images.value = await setImagenes("parques");
  } catch (e) {
    error.value = e;
  }
};

cargarFotos();
</script>


<style scoped>
.editar-images {
  display: grid;
  grid-template-columns: auto auto auto;
}
.images {
  display: flex;
  flex-direction: column;
}

.image {
  width: 10vw;
}

.btn-eliminar {
  width: 70px;
  height: 20px;
  margin-top: 0.2em;
}

/* Router-link asignar especies */
.asign-specie {
  text-decoration: none;
  color: var(--coloroscuro);
  font-weight: 700;
}
</style> >

