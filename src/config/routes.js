import LoginView from '../views/LoginView.vue'
import ConcertsView from '../views/ConcertsView.vue'
import ConcertsByCity from '../views/ConcertsByCity.vue'
import ConcertsByArtist from '../views/ConcertsByArtist.vue'
import ConcertsByGenre from '../views/ConcertsByGenre.vue'
import TicketsView from '../views/TicketsView.vue'
import RegisterForm from '../components/RegisterForm.vue'
import ConcertsAdminView from '../views/ConcertsAdminView.vue'
import ConcertCreateEdit from '../views/ConcertCreateEdit.vue'
import ConcertDetail from '../views/ConcertDetail.vue'

const routes = [
    {
      path: '/',
      label: 'Concerts',
      component: ConcertsView,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Concert'
      }
    },
    {
      path: '/concerts',
      label: 'Concerts',
      component: ConcertsView,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Concert'
      }
    },
    {
      path: '/concerts/genre',
      label: 'Genre',
      component: ConcertsByGenre,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Genre'
      }
    },
    {
      path: '/concerts/artist',
      label: 'Artist',
      component: ConcertsByArtist,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Artist'
      }
    },
    {
      path: '/concerts/city',
      label: 'City',
      component: ConcertsByCity,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'City'
      }
    },
    {
      path: '/tickets',
      label: 'Tickets',
      component: TicketsView,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Tickets'
      }
    },
    {
      path: '/newconcerts',
      label: 'newConcerts',
      component: ConcertsAdminView,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'newConcerts'
      }
    },
    {
      path: '/concerts/edit/:idConcert',
      label: 'Editar',
      component: ConcertCreateEdit,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Editar'
      }
    },
    {
      path: '/concerts/create',
      label: 'Crear',
      component: ConcertCreateEdit,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Crear'
      }
    },
    {
      path: '/concerts/detail/:idConcert',
      label: 'Detalle',
      component: ConcertDetail,
      meta: {
        header: true,
        access: true,
        iconMenuActive:'Detalle'
      }
    },
    {
      path: '/login',
      label: 'login',
      component: LoginView,
      meta: {
        header: false,
        access: true
      }
    },
    {
    path: '/register',
    label: 'register',
    component: RegisterForm,
    meta: {
      header: false,
      access: true
    }
  },
]

export default routes;