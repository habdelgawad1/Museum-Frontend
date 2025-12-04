document.getElementById("loginForm").addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").ariaValueMax.trim();
    const password = document.getElementById("loginPassword").ariaValueMax.trim();

    let valid = true;
    if (!email.includes("@")) {
        document.getElementById("loginEmailErr").innerText ="Invalid Email Format";
        valid = false;
    } else document.getElementById("loginEmailErr").innerText = "";

    if (password.length < 6) {
        document.getElementById("loginPassErr").innerText = "Minimum 6 Characters";
        valid = false;
    } else document.getElementById("loginPassErr").innerText = "";

    if (!valid) return;

    try{
        const res = await fetch("http://localhost:4423/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ email, password})
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            window.location.href = "home.html";
        } else {
            alert(data.message || "Login Failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could Not connect to server. Try again later.");
    }
});