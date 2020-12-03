import axios from 'axios';

const BuildClient = ({ req }) => {
	if (typeof window === 'undefined') {
		//we are on the server
		//request should be made to ingress
		return axios.create({
			baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers
		});
	} else {
		return axios.create({
			baseURL: '/'
		});
	}
};

export default BuildClient;