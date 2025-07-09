document
  .getElementById("consultation-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const feedbackEl = document.getElementById("form-feedback");
    const submitButton = this.querySelector('button[type="submit"]');
    const webhookUrl =
      "https://primary-production-9e0f.up.railway.app/webhook/739d8ccf-4a0a-479b-91e7-6427681622ff";

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      automationType: document.getElementById("automationType").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      needs: document.getElementById("needs").value,
    };

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    feedbackEl.textContent = "";
    feedbackEl.className = "mt-4";

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      feedbackEl.textContent = "Thank you! Your submission has been received.";
      feedbackEl.classList.add("alert", "alert-success");
      this.reset();
    } catch (error) {
      feedbackEl.textContent = `An error occurred: ${error.message}`;
      feedbackEl.classList.add("alert", "alert-danger");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit";
    }
  });