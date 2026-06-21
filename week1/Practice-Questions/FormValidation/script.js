function validateForm() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;

    if (name === "") {
        alert("Please enter your name");
        return false;
    }

    if (email === "") {
        alert("Please enter your email");
        return false;
    }

    alert("Form Submitted Successfully");
    return true;
}