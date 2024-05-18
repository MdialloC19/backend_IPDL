const optimisation = async (req, res) => {
    const query = new URLSearchParams({
        key: "3fb6637d-9c29-4d6e-92e0-f49a3e0815c3",
    }).toString();
    const { point } = req.body;

    const resp = await fetch(`https://graphhopper.com/api/1/route?${query}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            profile: "bike",
            points: [point[0], point[1]],
            point_hints: ["Lindenschmitstraße", "Thalkirchener Str."],
            snap_preventions: ["motorway", "ferry", "tunnel"],
            details: ["road_class", "surface"],
        }),
    });

    const data = await resp.json();
    console.log(data);
};

module.exports = optimisation;
