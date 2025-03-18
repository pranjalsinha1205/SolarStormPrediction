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
        const response = await fetch("/predict", {  // Adjust URL if hosted externally
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        document.querySelector(".form-container").innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            min-height: 50vh;
            max-height: 80vh;
            color: white;
        ">
            <img src="/static/${result.probability < 0.5 ? "solarStay.jpg" : "solarRun.jpg"}" 
                alt="Solar Activity"
                style="
                    width: 100%;
                    max-width: 400px;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0px 4px 8px rgba(255, 255, 255, 0.2);
                "
            >
            <h3 style="margin-top: 10px; font-size: 1.5em;">
                There will be ${result.storm_prediction}
            </h3>
        </div>
    `; 
    } catch (error) {
        document.getElementById("result").innerText = "Error predicting storm! " + error.message;
    }
});