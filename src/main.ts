import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'virtual:svg-icons-register';
import SvgIcon from './components/SvgIcon.vue';

createApp(App)
	.component('svg-icon', SvgIcon)
	.mount('#app');
