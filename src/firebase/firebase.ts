import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyBUU0M7prf4PEQCtNHjedJ7ipZgrkAFn9g",
	authDomain: "pose-tesis.firebaseapp.com",
	projectId: "pose-tesis",
	storageBucket: "pose-tesis.appspot.com",
	messagingSenderId: "724378200138",
	appId: "1:724378200138:web:41a702d84e0868f1c1deb3",
	measurementId: "G-SJ3DNDYRNK"
};

export const app = initializeApp(firebaseConfig);
