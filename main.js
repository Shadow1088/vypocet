 // Initialize the inputs and its attributes
            const triangleInputs = [
                { id: "a", label: "Side a", type: "side" },
                { id: "b", label: "Side b", type: "side" },
                { id: "c", label: "Side c", type: "side" },
                { id: "alpha", label: "Angle α", type: "angle" },
                { id: "beta", label: "Angle β", type: "angle" },
            ];

            // Create an input field for each input
            function createInputFields() {
                const form = document.getElementById("inputForm");
                triangleInputs.forEach((input) => {
                    const col = document.createElement("div");
                    col.className = "col-md-4";
                    col.innerHTML = 
                                    <label class="form-label">${input.label}</label>
                                    <input
                                        type="number"
                                        class="form-control bg-dark text-light"
                                        id="input${input.id.charAt(0).toUpperCase() + input.id.slice(1)}"
                                        placeholder="Enter ${input.type}"
                                    />
                                ; // The id works like this= takes first letter and upper cases it,
                    //then it slices the string after the first letter and append
                    // the second part, if its just "a" theres nothing to add and the result is
                    // "A"
                    // otherwise its "A" + "lpha" ..for example

                    // Adds the element into "col" div
                    form.appendChild(col);
                });
            }

            // Get our input values
            function getInputValues() {
                return {
                    a: parseFloat(document.getElementById("inputA").value),
                    b: parseFloat(document.getElementById("inputB").value),
                    c: parseFloat(document.getElementById("inputC").value),
                    alpha: parseFloat(
                        document.getElementById("inputAlpha").value,
                    ),
                    beta: parseFloat(
                        document.getElementById("inputBeta").value,
                    ),
                };
            }

            // Trigonometry functions require angles to be in radians, so we convert our degrees into radians
            // Of course if possible we use pythagorovka
            const calculatorMethods = {
                a: {
                    fromBC: (b, c) => Math.sqrt(c * c - b * b),

                    fromBAlpha: (b, alpha) =>
                        b * Math.tan((alpha * Math.PI) / 180),

                    fromCAlpha: (c, alpha) =>
                        c * Math.sin((alpha * Math.PI) / 180),

                    fromBBeta: (b, beta) =>
                        b / Math.tan((beta * Math.PI) / 180),

                    fromCBeta: (c, beta) =>
                        c * Math.cos((beta * Math.PI) / 180),
                },
                b: {
                    fromAC: (a, c) => Math.sqrt(c * c - a * a),

                    fromAAlpha: (a, alpha) =>
                        a / Math.tan((alpha * Math.PI) / 180),

                    fromCAlpha: (c, alpha) =>
                        c * Math.cos((alpha * Math.PI) / 180),

                    fromABeta: (a, beta) =>
                        a * Math.tan((beta * Math.PI) / 180),

                    fromCBeta: (c, beta) =>
                        c * Math.sin((beta * Math.PI) / 180),
                },
                c: {
                    fromAB: (a, b) => Math.sqrt(a * a + b * b),

                    fromAAlpha: (a, alpha) =>
                        a / Math.sin((alpha * Math.PI) / 180),

                    fromBAlpha: (a, alpha) =>
                        b / Math.cos((alpha * Math.PI) / 180),

                    fromBBeta: (b, beta) =>
                        b / Math.sin((beta * Math.PI) / 180),

                    fromABeta: (a, beta) =>
                        a / Math.cos((beta * Math.PI) / 180),
                },
                alpha: {
                    fromAB: (a, b) => (Math.atan(a / b) * 180) / Math.PI,
                    fromAC: (a, c) => (Math.asin(a / c) * 180) / Math.PI,
                    fromBC: (b, c) => (Math.acos(b / c) * 180) / Math.PI,
                    fromBeta: (beta) => 90 - beta,

                    fromCBeta: (c, beta) =>
                        (Math.asin(c * Math.sin((beta * Math.PI) / 180)) *
                            180) /
                        Math.PI,
                },
                beta: {
                    fromBC: (b, c) => (Math.asin(b / c) * 180) / Math.PI,
                    fromAB: (a, b) => (Math.atan(b / a) * 180) / Math.PI,
                    fromAC: (a, c) => (Math.acos(a / c) * 180) / Math.PI,
                    fromAlpha: (alpha) => 90 - alpha,

                    fromCAlpha: (c, alpha) =>
                        (Math.acos(c * Math.cos((alpha * Math.PI) / 180)) *
                            180) /
                        Math.PI,
                },
            };

            // Main calculation function
            function calculate(target) {
                const values = getInputValues();
                const result = document.getElementById("result");
                result.style.display = "block"; // Make the result element visible

                if (values[target]) {
                    result.textContent = ${triangleInputs.find((i) => i.id === target).label} is already known: ${values[target].toFixed(2)};
                    return; // Exit the function
                }

                try {
                    // We declare a constant to shorten our code and make our lives easier
                    const methods = calculatorMethods[target];
                    let calculated;

                    // We decide how to solve our target here
                    switch (target) {
                        case "a":
                            if (values.b && values.c) {
                                calculated = methods.fromBC(values.b, values.c);
                            } else if (values.b && values.alpha) {
                                calculated = methods.fromBAlpha(
                                    values.b,
                                    values.alpha,
                                );
                            } else if (values.c && values.alpha) {
                                calculated = methods.fromCAlpha(
                                    values.c,
                                    values.alpha,
                                );
                            } else if (values.b && values.beta) {
                                calculated = methods.fromBBeta(
                                    values.b,
                                    values.beta,
                                );
                            } else if (values.c && values.beta) {
                                calculated = methods.fromCBeta(
                                    values.c,
                                    values.beta,
                                );
                            }
                            break;

                        case "b":
                            if (values.a && values.c) {
                                calculated = methods.fromAC(values.a, values.c);
                            } else if (values.a && values.alpha) {
                                calculated = methods.fromAAlpha(
                                    values.a,
                                    values.alpha,
                                );
                            } else if (values.c && values.alpha) {
                                calculated = methods.fromCAlpha(
                                    values.c,
                                    values.alpha,
                                );
                            } else if (values.a && values.beta) {
                                calculated = methods.fromABeta(
                                    values.a,
                                    values.beta,
                                );
                            } else if (values.c && values.beta) {
                                calculated = methods.fromCBeta(
                                    values.c,
                                    values.beta,
                                );
                            }
                            break;

                        case "c":
                            if (values.a && values.b) {
                                calculated = methods.fromAB(values.a, values.b);
                            } else if (values.a && values.alpha) {
                                calculated = methods.fromAAlpha(
                                    values.a,
                                    values.alpha,
                                );
                            } else if (values.b && values.alpha) {
                                calculated = methods.fromBAlpha(
                                    values.b,
                                    values.alpha,
                                );
                            } else if (values.b && values.beta) {
                                calculated = methods.fromBBeta(
                                    values.b,
                                    values.beta,
                                );
                            } else if (values.a && values.beta) {
                                calculated = methods.fromABeta(
                                    values.a,
                                    values.beta,
                                );
                            }
                            break;

                        case "alpha":
                            if (values.a && values.b) {
                                calculated = methods.fromAB(values.a, values.b);
                            } else if (values.a && values.c) {
                                calculated = methods.fromAC(values.a, values.c);
                            } else if (values.b && values.c) {
                                calculated = methods.fromBC(values.b, values.c);
                            } else if (values.beta) {
                                calculated = methods.fromBeta(values.beta);
                            } else if (values.c && values.beta) {
                                calculated = methods.fromCBeta(
                                    values.c,
                                    values.beta,
                                );
                            }
                            break;

                        case "beta":
                            if (values.b && values.c) {
                                calculated = methods.fromBC(values.b, values.c);
                            } else if (values.a && values.b) {
                                calculated = methods.fromAB(values.a, values.b);
                            } else if (values.a && values.c) {
                                calculated = methods.fromAC(values.a, values.c);
                            } else if (values.alpha) {
                                calculated = methods.fromAlpha(values.alpha);
                            } else if (values.c && values.alpha) {
                                calculated = methods.fromCAlpha(
                                    values.c,
                                    values.alpha,
                                );
                            }
                            break;
                    }

                    if (calculated !== undefined) {
                        // Add a symbol behind the result if needed
                        const symbol =
                            target === "alpha" || target === "beta" ? "°" : "";

                        // Show the result
                        result.textContent = ${triangleInputs.find((i) => i.id === target).label} = ${calculated.toFixed(2)}${symbol};
                    } else {
                        result.textContent = Need more info to calculate ${triangleInputs.find((i) => i.id === target).label.toLowerCase()};
                    }
                } catch (error) {
                    result.textContent =
                        "Error in calculation. Please check your input.";
                }
            }

            // Initialize the calculator

            createInputFields();
            // Adds event.listener for click on the triangle lines and
            // triggers the calculation for the chosen value
            document.querySelectorAll("[data-target]").forEach((element) => {
                element.addEventListener(
                    "click",
                    (e) => calculate(e.target.dataset.target),
                    // e.target - the element that was clicked
                    // dataset is something from bootstrap - it accesses all custom data attributes
                    // dataset.target - accesses value of our data-target attribute
                    // so the whole thing returns the target
                );
            });
