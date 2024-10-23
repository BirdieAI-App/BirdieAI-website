import React, { useEffect } from "react";

const DRICalculator = () => {
    const customStyle = {
        width: "560px",
        visibility: "visible",
        opacity: 1,
        display: "block",
        margin: "12px",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: 1.15,
        color: "rgb(102, 102, 102)",
        boxSizing: "border-box",
        background: "rgb(249, 249, 249)",
        border: "1px solid rgb(238, 238, 238)",
        borderRadius: "8px",
      };
      

    useEffect(() => {
        // Dynamically load the Omni calculator SDK script
        const script = document.createElement("script");
        script.src = "https://cdn.omnicalculator.com/sdk.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script if component is unmounted
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div
            className="omni-calculator"
            data-calculator="all/dri"
            data-width="560"
            data-config='{
            "height": {"unitDefault": "ftinch"},
            "weight": {"unitDefault": "lb"},
            "age": {"autosaved": false, "default": "8"},
            "pregnancy": {
              "autosaved": true,
              "default": "1",
              "help": "Pregnancy and Breastfeeding Status"
            },
            "sex": {"autosaved": true},
            "activity_factor": {"autosaved": true},
            "valueSelects": {
              "Iobe3UhCTNOdgofQHxvDE": {
                "Not pregnant or lactating": {"name": "0"},
                "Pregnant": {"name": "1"},
                "Lactating": {"name": "2"}
              }
            }
          }'
            data-currency="USD"
            data-show-row-controls="true"
            data-version="3"
            data-t="1721330815471"
            style={customStyle}
        >
            <div className="omni-calculator-header">DRI Calculator</div>
            <div className="omni-calculator-footer">
                <a href="https://www.omnicalculator.com/all/dri" target="_blank" rel="noopener noreferrer">
                    <img
                        alt="Omni"
                        className="omni-calculator-logo"
                        src="https://cdn.omnicalculator.com/embed/omni-calculator.svg"
                    />
                </a>
            </div>
        </div>
    );
};

export default DRICalculator;
