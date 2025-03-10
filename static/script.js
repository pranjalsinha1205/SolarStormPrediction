document.getElementById("stormForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent page reload

    const inputData = {
        "Scalar B, nT": parseFloat(document.getElementById("scalar_b").value),
        "BZ, nT (GSM)": parseFloat(document.getElementById("bz_gsm").value),
        "SW Proton Density, N/cm^3": parseFloat(document.getElementById("proton_density").value),
        "SW Plasma Speed, km/s": parseFloat(document.getElementById("plasma_speed").value),
        "Flow pressure": parseFloat(document.getElementById("flow_pressure").value),
        "E electric field": parseFloat(document.getElementById("electric_field").value),
        "Alfen mach number": parseFloat(document.getElementById("alfven_mach").value),
        "Dst-index, nT": parseFloat(document.getElementById("dst_index").value),
        "f10.7_index": parseFloat(document.getElementById("f10_index").value),
        "AE-index, nT": parseFloat(document.getElementById("ae_index").value)
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData)
        });

        const result = await response.json();
        document.getElementById("result").innerText = `Prediction: ${result.storm_prediction}, Probability: ${result.probability}`;
    } catch (error) {
        document.getElementById("result").innerText = "Error predicting storm!";
    }
});
