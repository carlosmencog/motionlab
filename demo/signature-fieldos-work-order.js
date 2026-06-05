(function () {
  const root = document.querySelector("[data-fieldos-experience]");
  const stage = document.querySelector("[data-fieldos-stage]");
  const ticket = document.querySelector("[data-ticket]");

  if (!root || !stage || !ticket) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 720px)").matches;

  const chapters = {
    intake: document.querySelector('[data-chapter="intake"]'),
    dispatch: document.querySelector('[data-chapter="dispatch"]'),
    field: document.querySelector('[data-chapter="field"]'),
    completion: document.querySelector('[data-chapter="completion"]'),
  };

  const statusEl = document.querySelector("[data-ticket-status]");
  const detailEl = document.querySelector("[data-ticket-detail]");
  const techEl = document.querySelector("[data-ticket-tech]");
  const etaEl = document.querySelector("[data-ticket-eta]");
  const routeEl = document.querySelector("[data-ticket-route]");
  const dispatchEl = document.querySelector("[data-ticket-dispatch]");
  const noteTextEl = document.querySelector("[data-ticket-note-text]");
  const ratingEl = document.querySelector("[data-ticket-rating]");
  const invoiceEl = document.querySelector("[data-ticket-invoice]");
  const proofEl = document.querySelector("[data-ticket-proof]");
  const timeEl = document.querySelector("[data-ticket-time]");
  const assignmentEl = document.querySelector("[data-ticket-assignment]");
  const completionEl = document.querySelector("[data-ticket-completion]");
  const noteEl = document.querySelector("[data-ticket-note]");
  const identityEl = document.querySelector(".ticket__identity");
  const timelineItems = Array.from(document.querySelectorAll("[data-phase]"));
  const steps = Array.from(document.querySelectorAll("[data-step]"));

  const states = {
    intake: {
      status: "New",
      detail: "Kitchen leak captured with service, customer, and priority.",
      tech: "Unassigned",
      eta: "Pending",
      route: "Pending",
      dispatch: "Waiting",
      completeSteps: [],
      activeStep: "",
      phase: "intake",
      note: "No field note yet.",
      rating: "Rating pending",
      invoice: "Invoice pending",
      proof: "Proof pending",
      time: "Completion time pending",
      emphasis: ".ticket__identity",
    },
    dispatch: {
      status: "Assigned",
      detail: "Dispatch confirmed Mike as the owner for WO-2048.",
      tech: "Mike",
      eta: "45 min",
      route: "North Loop",
      dispatch: "Confirmed",
      completeSteps: [],
      activeStep: "",
      phase: "dispatch",
      note: "Mike accepted the job and is en route.",
      rating: "Rating pending",
      invoice: "Invoice pending",
      proof: "Proof pending",
      time: "Completion time pending",
      emphasis: ".ticket__assignment",
    },
    field: {
      status: "In progress",
      detail: "Repair is active after diagnosis and parts confirmation.",
      tech: "Mike",
      eta: "On site",
      route: "On site",
      dispatch: "Arrived",
      completeSteps: ["diagnose", "parts"],
      activeStep: "repair",
      phase: "repair",
      note: "Replaced supply valve. Drying cabinet base before verification.",
      rating: "Rating pending",
      invoice: "Invoice pending",
      proof: "Proof pending",
      time: "Completion time pending",
      emphasis: ".ticket__steps",
    },
    completion: {
      status: "Completed",
      detail: "The leak is repaired and proof is attached.",
      tech: "Mike",
      eta: "Closed",
      route: "Complete",
      dispatch: "Closed",
      completeSteps: ["diagnose", "parts", "repair", "verification"],
      activeStep: "",
      phase: "complete",
      note: "Customer confirmed the repair and signed off on site.",
      rating: "5 star rating",
      invoice: "Invoice sent",
      proof: "Before/after attached",
      time: "Completed in 2h 10m",
      emphasis: ".ticket__completion",
    },
  };

  let activeState = "";
  let timeline = null;

  function showChapter(name) {
    Object.entries(chapters).forEach(([chapterName, el]) => {
      el?.classList.toggle("is-active", chapterName === name);
    });
  }

  function setTicketState(name) {
    if (activeState === name) {
      return;
    }

    activeState = name;
    const state = states[name];

    statusEl.textContent = state.status;
    detailEl.textContent = state.detail;
    techEl.textContent = state.tech;
    etaEl.textContent = state.eta;
    routeEl.textContent = state.route;
    dispatchEl.textContent = state.dispatch;
    noteTextEl.textContent = state.note;
    ratingEl.textContent = state.rating;
    invoiceEl.textContent = state.invoice;
    proofEl.textContent = state.proof;
    timeEl.textContent = state.time;

    [ratingEl, invoiceEl, proofEl, timeEl].forEach((el) => {
      el.classList.toggle("is-done", name === "completion");
    });

    steps.forEach((step) => {
      step.classList.toggle("is-complete", state.completeSteps.includes(step.dataset.step));
      step.classList.toggle("is-active", step.dataset.step === state.activeStep);
    });

    const phaseOrder = ["intake", "dispatch", "repair", "complete"];
    const currentPhaseIndex = phaseOrder.indexOf(state.phase);
    timelineItems.forEach((item) => {
      const itemIndex = phaseOrder.indexOf(item.dataset.phase);
      item.classList.toggle("is-complete", itemIndex < currentPhaseIndex);
      item.classList.toggle("is-active", itemIndex === currentPhaseIndex);
    });

    [identityEl, assignmentEl, completionEl, noteEl, document.querySelector(".ticket__state"), document.querySelector(".ticket__steps")]
      .filter(Boolean)
      .forEach((el) => el.classList.remove("is-emphasized"));

    document.querySelector(state.emphasis)?.classList.add("is-emphasized");
  }

  function stateFromProgress(progress) {
    if (progress < 0.25) return "intake";
    if (progress < 0.5) return "dispatch";
    if (progress < 0.75) return "field";
    return "completion";
  }

  function updateStateFromTimeline() {
    if (!timeline) {
      return;
    }

    const state = stateFromProgress(timeline.progress());
    showChapter(state);
    setTicketState(state);
  }

  if (reduceMotion || isMobile || !window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("reduced-motion");
    showChapter("intake");
    setTicketState("completion");
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(Object.values(chapters), { autoAlpha: 0, y: 28 });
  gsap.set(chapters.intake, { autoAlpha: 1, y: 0 });
  gsap.set(ticket, { xPercent: -50, yPercent: -50, x: 240, y: 0, scale: 1, opacity: 1 });
  setTicketState("intake");

  timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "+=320%",
      pin: stage,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: updateStateFromTimeline,
      onRefresh: updateStateFromTimeline,
    },
  });

  timeline
    .to(ticket, { x: -250, y: -70, scale: 0.92, opacity: 1, duration: 1 })
    .to(chapters.intake, { autoAlpha: 0, y: -28, duration: 0.25 }, "<")
    .to(chapters.dispatch, { autoAlpha: 1, y: 0, duration: 0.25 }, "<0.25")
    .to(ticket, { x: 260, y: 76, scale: 1.04, opacity: 1, duration: 1 })
    .to(chapters.dispatch, { autoAlpha: 0, y: -28, duration: 0.25 }, "<")
    .to(chapters.field, { autoAlpha: 1, y: 0, duration: 0.25 }, "<0.25")
    .to(ticket, { x: -210, y: 92, scale: 0.96, opacity: 1, duration: 1 })
    .to(chapters.field, { autoAlpha: 0, y: -28, duration: 0.25 }, "<")
    .to(chapters.completion, { autoAlpha: 1, y: 0, duration: 0.25 }, "<0.25")
    .to(ticket, { x: 170, y: -42, scale: 1, opacity: 1, duration: 1 });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
