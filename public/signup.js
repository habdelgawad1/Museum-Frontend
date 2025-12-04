document.getElementById("Signupform").addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = document.getElementById("SignupEmail").value.trim();
    const password = document.getElementById("SignupPassword").value.trim();

    let valid = true;
    if (!email.includes("@")) {
        document.getElementById("SignupEmailErr").innerText ="Invalid Email Format";
        valid = false;
    } else document.getElementById("SignupEmailErr").innerText = "";

    if (password.length < 6) {
        document.getElementById("SignupPasswordErr").innerText = "Minimum 6 Characters";
        valid = false;
    } else document.getElementById("SignupPasswordErr").innerText = "";

    if (!valid) return;

    try{
        const res = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ email, password})
        });

        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup Failed");
        }
    } catch (err) {
        console.log(err);
        alert("Could Not connect to server. Try again later.");
    }
});
