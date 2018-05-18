import HistoryRouter from './Route/HistoryRouter';
// import Home from './components/Home';
// import List from './components/List';
const historyRouter = new HistoryRouter('#app');
const Home = () => import(/* webpackChunkName: "home" */ './components/Home.js');
const List = () => import(/* webpackChunkName: "list" */ './components/List.js');
// const List = () => {
//     require.ensure(
//         [],
//         require => {
//             require('./components/List');
//         },
//         'list',
//     );
// };
const Detail = () => import(/* webpackChunkName: "detail" */ './components/Detail.js');

historyRouter.register('/', Home, 'home');
historyRouter.register('/list', List, 'list');
historyRouter.register('/detail', Detail, 'detail');
