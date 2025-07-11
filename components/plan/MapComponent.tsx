import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { LeafletView } from "react-native-leaflet-view";

const ALBI_COORDS = { latitude: 43.929, longitude: 2.148 };

const MapComponent = () => {
	const [webViewContent, setWebViewContent] = useState<string | null>(null);
	useEffect(() => {
		let isMounted = true;

		const loadHtml = async () => {
			try {
				const path = require("../../assets/leaflet.html");
				const asset = Asset.fromModule(path);
				await asset.downloadAsync();
				const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

				if (isMounted) {
					setWebViewContent(htmlContent);
				}
			} catch (error) {
				Alert.alert("Error loading HTML", JSON.stringify(error));
				console.error("Error loading HTML:", error);
			}
		};

		loadHtml();

		return () => {
			isMounted = false;
		};
	}, []);

	if (!webViewContent) {
		return <ActivityIndicator size="large" />;
	}
	return (
		<LeafletView
			source={{ html: webViewContent }}
			mapCenterPosition={{
				lat: ALBI_COORDS.latitude,
				lng: ALBI_COORDS.longitude,
			}}
		/>
	);
};

export default MapComponent;
