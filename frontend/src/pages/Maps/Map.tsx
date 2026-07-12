import React, { useState, ChangeEvent } from "react";

const Map: React.FC = () => {
    const [mapImage, setMapImage] = useState<string | null>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setMapImage(imageUrl);
        }
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h2>Map</h2>
            <p>Upload your port map image below.</p>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: "20px" }}
            />

            {mapImage ? (
                <div>
                    <h3>Map Preview</h3>
                    <img
                        src={mapImage}
                        alt="Uploaded Map"
                        style={{
                            width: "100%",
                            maxHeight: "600px",
                            objectFit: "contain",
                            border: "2px solid #ccc",
                            borderRadius: "8px",
                        }}
                    />
                </div>
            ) : (
                <div
                    style={{
                        height: "300px",
                        border: "2px dashed #aaa",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#777",
                    }}
                >
                    No map uploaded
                </div>
            )}
        </div>
    );
};

export default Map;