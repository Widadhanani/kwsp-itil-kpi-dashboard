/* =========================================================
   KWSP / EPF
   ITIL KPI DASHBOARD 2026
   FULL SCRIPT.JS
========================================================= */


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   GET PROCESS DATA
========================================================= */

function getProcessData() {
    if (
        typeof PROCESS_DATA === "undefined" ||
        !Array.isArray(PROCESS_DATA)
    ) {
        console.error(
            "PROCESS_DATA not found. Make sure data.js is loaded before script.js."
        );

        return [];
    }

    return PROCESS_DATA;
}


/* =========================================================
   GET RESULT 2026 DATA
========================================================= */

function getResultData() {
    if (
        typeof RESULT_2026 === "undefined" ||
        !RESULT_2026 ||
        !Array.isArray(RESULT_2026.headers) ||
        !Array.isArray(RESULT_2026.rows)
    ) {
        console.error(
            "RESULT_2026 not found in data.js."
        );

        return null;
    }

    return RESULT_2026;
}


/* =========================================================
   DASHBOARD
========================================================= */

function loadDashboard() {
    const dashboardBody =
        document.getElementById("dashboardBody");

    if (!dashboardBody) {
        return;
    }

    const processes = getProcessData();

    const totalProcess =
        processes.length;

    const totalGroups =
        processes.reduce(
            (total, process) =>
                total + Number(process.count || 0),
            0
        );

    const totalRows =
        processes.reduce(
            (total, process) =>
                total +
                (
                    Array.isArray(process.rows)
                        ? process.rows.length
                        : 0
                ),
            0
        );


    const statProcess =
        document.getElementById("statProcess");

    const statGroups =
        document.getElementById("statGroups");

    const statRows =
        document.getElementById("statRows");


    if (statProcess) {
        statProcess.textContent = totalProcess;
    }

    if (statGroups) {
        statGroups.textContent = totalGroups;
    }

    if (statRows) {
        statRows.textContent = totalRows;
    }


    dashboardBody.innerHTML = "";


    processes.forEach((process, index) => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                ${index + 1}
            </td>

            <td>
                <strong>
                    ${escapeHTML(process.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(process.count)}
            </td>

            <td>
                <a
                    href="overall.html?process=${encodeURIComponent(process.name)}"
                    class="view-btn"
                >
                    View KPI

                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </td>
        `;


        dashboardBody.appendChild(row);

    });
}


/* =========================================================
   OVERALL KPI
   LOAD PROCESS CARDS
========================================================= */

function loadProcessCards() {
    const grid =
        document.getElementById("processGrid");

    if (!grid) {
        return;
    }


    const processes =
        getProcessData();


    grid.innerHTML = "";


    processes.forEach((process, index) => {

        const card =
            document.createElement("article");


        card.className =
            "process-card";


        card.dataset.name =
            String(process.name || "").toLowerCase();


        const icon =
            process.icon || "fa-list-check";


        card.innerHTML = `
            <div class="process-icon">

                <i class="fa-solid ${escapeHTML(icon)}"></i>

            </div>


            <h3>
                ${escapeHTML(process.name)}
            </h3>


            <p>
                <strong>
                    ${escapeHTML(process.count)}
                </strong>

                KPI Group(s)
            </p>


            <button
                type="button"
                class="process-view-button"
                data-index="${index}"
            >
                View KPI

                <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;


        const button =
            card.querySelector(
                ".process-view-button"
            );


        button.addEventListener(
            "click",
            function () {
                viewProcess(index);
            }
        );


        grid.appendChild(card);

    });
}


/* =========================================================
   OVERALL KPI
   VIEW PROCESS
========================================================= */

/* =========================================================
   OVERALL KPI
   VIEW PROCESS
   AUTO MERGE CONTINUATION ROWS
========================================================= */

function viewProcess(index) {

    const processes =
        getProcessData();

    const process =
        processes[index];


    if (!process) {

        console.error(
            "Process not found:",
            index
        );

        return;
    }


    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const processList =
        document.getElementById(
            "processList"
        );

    const processDetail =
        document.getElementById(
            "processDetail"
        );

    const processTitle =
        document.getElementById(
            "processTitle"
        );

    const processCount =
        document.getElementById(
            "processCount"
        );

    const kpiBody =
        document.getElementById(
            "kpiBody"
        );


    if (
        !processList ||
        !processDetail ||
        !kpiBody
    ) {
        return;
    }


    /* =====================================================
       SHOW DETAIL PAGE
    ===================================================== */

    processList.style.display =
        "none";

    processDetail.style.display =
        "block";


    if (processTitle) {

        processTitle.textContent =
            process.name;
    }


    if (processCount) {

        processCount.textContent =
            `${process.count} KPI Group(s)`;
    }


    /* =====================================================
       GET ROWS
    ===================================================== */

    kpiBody.innerHTML = "";


    const rows =
        Array.isArray(process.rows)
            ? process.rows
            : [];


    if (rows.length === 0) {

        kpiBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty-table-cell"
                >
                    No KPI data available.
                </td>
            </tr>
        `;

        return;
    }


    /* =====================================================
       HELPER - CHECK VALUE
    ===================================================== */

    function hasValue(value) {

        return (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        );
    }


    /* =====================================================
       HELPER - BADGES
    ===================================================== */

    function renderNumber(value) {

        if (!hasValue(value)) {
            return "-";
        }

        return `
            <span class="number-badge">
                ${escapeHTML(value)}
            </span>
        `;
    }


    function renderFrequency(value) {

        if (!hasValue(value)) {
            return "-";
        }

        return `
            <span class="frequency-badge">
                ${escapeHTML(value)}
            </span>
        `;
    }


    function renderTarget(value) {

        if (!hasValue(value)) {
            return "-";
        }

        return `
            <span class="target-value">
                ${escapeHTML(value)}
            </span>
        `;
    }


    function renderStretch(value) {

        if (!hasValue(value)) {
            return "-";
        }

        return `
            <span class="stretch-value">
                ${escapeHTML(value)}
            </span>
        `;
    }


    function renderKPI(value) {

        if (!hasValue(value)) {
            return "-";
        }

        return escapeHTML(value)
            .replaceAll(
                "\n",
                "<br>"
            );
    }


    /* =====================================================
       RENDER ROWS
    ===================================================== */

    let i = 0;


    while (i < rows.length) {

        const row =
            rows[i] || {};


        /* =================================================
           GROUP HEADING

           Contoh:
           Service Availability
           Service Performance
        ================================================= */

        const isGroupRow =
    /^\d+$/.test(String(row.no || "").trim()) &&
    hasValue(row.kpi) &&
    !hasValue(row.frequency) &&
    !hasValue(row.target) &&
    !hasValue(row.stretch);

        if (isGroupRow) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.classList.add(
                "group-row"
            );


            tr.innerHTML = `

                <td class="number-cell">

                    ${renderNumber(row.no)}

                </td>


                <td class="kpi-name">

                    ${renderKPI(row.kpi)}

                </td>


                <td class="center-cell">
                    -
                </td>


                <td class="center-cell">
                    -
                </td>


                <td class="center-cell">
                    -
                </td>

            `;


            kpiBody.appendChild(tr);


            i++;

            continue;
        }


        /* =================================================
           CHECK CONTINUATION ROWS

           Contoh:

           4 | KPI NAME | 1 time BCM Plan
             |          | 1 time ITSCM Plan
             |          | 1 time DR Procedures
        ================================================= */
/* =================================================
   CHECK CONTINUATION ROWS
   Merge row sambungan macam Excel
================================================= */

let rowSpan = 1;


/*
   Hanya mula check continuation
   kalau row sekarang ialah KPI utama
*/
if (
    hasValue(row.no) &&
    hasValue(row.kpi)
) {

    let nextIndex = i + 1;


    while (nextIndex < rows.length) {

        const nextRow =
            rows[nextIndex] || {};


        const nextNo =
            String(
                nextRow.no ?? ""
            ).trim();


        const nextKPI =
            String(
                nextRow.kpi ?? ""
            ).trim();


        /*
           Kalau row seterusnya ada nombor KPI baru,
           maksudnya dah masuk KPI lain.
        */
        const hasNewNumber =
            nextNo !== "" &&
            nextNo !== "-";


        /*
           Kalau row seterusnya ada nama KPI baru,
           maksudnya dah masuk KPI lain.
        */
        const hasNewKPI =
            nextKPI !== "" &&
            nextKPI !== "-";


        /*
           STOP bila jumpa KPI baru
        */
        if (
            hasNewNumber ||
            hasNewKPI
        ) {
            break;
        }


        /*
           Kalau No dan KPI kosong / "-"
           = continuation kepada KPI sebelumnya.

           Tak kisah frequency / target / stretch
           ada value atau kosong.
        */
        rowSpan++;


        nextIndex++;
    }
}


        /* =================================================
           MAIN KPI ROW
        ================================================= */

        const tr =
            document.createElement(
                "tr"
            );


        let html = "";


        /* =================================================
           NO COLUMN
           ROWSPAN JIKA ADA CONTINUATION
        ================================================= */

        html += `

            <td
                class="number-cell"
                ${rowSpan > 1
                    ? `rowspan="${rowSpan}"`
                    : ""
                }
            >

                ${renderNumber(row.no)}

            </td>

        `;


        /* =================================================
           KPI NAME COLUMN
           ROWSPAN JIKA ADA CONTINUATION
        ================================================= */

        html += `

            <td
                class="kpi-name"
                ${rowSpan > 1
                    ? `rowspan="${rowSpan}"`
                    : ""
                }
            >

                ${renderKPI(row.kpi)}

            </td>

        `;


        /* =================================================
           FREQUENCY
        ================================================= */

        html += `

            <td class="center-cell">

                ${renderFrequency(
                    row.frequency
                )}

            </td>

        `;


        /* =================================================
           TARGET
        ================================================= */

        html += `

            <td class="center-cell">

                ${renderTarget(
                    row.target
                )}

            </td>

        `;


        /* =================================================
           STRETCH TARGET
        ================================================= */

        html += `

            <td class="center-cell">

                ${renderStretch(
                    row.stretch
                )}

            </td>

        `;


        tr.innerHTML =
            html;


        kpiBody.appendChild(
            tr
        );


        /* =================================================
           RENDER CONTINUATION ROW
        ================================================= */

        if (rowSpan > 1) {

            for (
                let j = 1;
                j < rowSpan;
                j++
            ) {

                const continuationRow =
                    rows[i + j] || {};


                const continuationTr =
                    document.createElement(
                        "tr"
                    );


                continuationTr.classList.add(
                    "continuation-row"
                );


                /*
                   PENTING:

                   Tak render No.
                   Tak render KPI Name.

                   Sebab dua cell tersebut
                   sudah menggunakan rowspan.
                */

                continuationTr.innerHTML = `

                    <td class="center-cell">

                        ${renderFrequency(
                            continuationRow.frequency
                        )}

                    </td>


                    <td class="center-cell">

                        ${renderTarget(
                            continuationRow.target
                        )}

                    </td>


                    <td class="center-cell">

                        ${renderStretch(
                            continuationRow.stretch
                        )}

                    </td>

                `;


                kpiBody.appendChild(
                    continuationTr
                );
            }
        }


        /* =================================================
           SKIP ROW YANG DAH DIGABUNG
        ================================================= */

        i += rowSpan;
    }


    /* =====================================================
       RESET SEARCH
    ===================================================== */

    const kpiSearch =
        document.getElementById(
            "kpiSearch"
        );


    if (kpiSearch) {

        kpiSearch.value = "";
    }


    /* =====================================================
       SCROLL TOP
    ===================================================== */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });
}


/* =========================================================
   OVERALL KPI
   BACK
========================================================= */

function closeProcess() {
    const processList =
        document.getElementById(
            "processList"
        );


    const processDetail =
        document.getElementById(
            "processDetail"
        );


    if (processList) {
        processList.style.display =
            "block";
    }


    if (processDetail) {
        processDetail.style.display =
            "none";
    }


    const kpiSearch =
        document.getElementById(
            "kpiSearch"
        );


    if (kpiSearch) {
        kpiSearch.value = "";
    }


    if (
        window.history &&
        window.history.replaceState
    ) {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   OVERALL KPI
   PROCESS SEARCH
========================================================= */

function setupProcessSearch() {
    const input =
        document.getElementById(
            "processSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const keyword =
                input.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    "#processGrid .process-card"
                );


            cards.forEach(card => {

                const name =
                    card.dataset.name || "";


                card.style.display =
                    name.includes(keyword)
                        ? "flex"
                        : "none";

            });

        }
    );
}


/* =========================================================
   OVERALL KPI
   KPI SEARCH
========================================================= */

function setupKPISearch() {
    const input =
        document.getElementById(
            "kpiSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const keyword =
                input.value
                    .toLowerCase()
                    .trim();


            const rows =
                document.querySelectorAll(
                    "#kpiBody tr"
                );


            rows.forEach(row => {

                const text =
                    row.innerText
                        .toLowerCase();


                row.style.display =
                    text.includes(keyword)
                        ? ""
                        : "none";

            });

        }
    );
}


/* =========================================================
   RESULT 2026
   PROCESS ALIASES
========================================================= */

const RESULT_PROCESS_ALIASES = {

    "Incident Management": [
        "Incident Management"
    ],

    "Service Request Management": [
        "Service Request Management"
    ],

    "Knowledge Management": [
        "Knowledge Management"
    ],

    "Availability Management": [
        "Availability Management"
    ],

    "Capacity Management": [
        "Capacity Management"
    ],

    "SLM & BRM": [
        "SLM & BRM",
        "Service Level Management",
        "Business Relationship Management"
    ],

    "IT Security Management": [
        "IT Security Management"
    ],

    "Change & Release Management": [
        "Change & Release Management"
    ],

    "Problem Management": [
        "Problem Management"
    ],

    "Supplier Management": [
        "Supplier Management"
    ],

    "Configuration Management": [
        "Configuration Management"
    ],

    "Financial Management": [
        "Financial Management"
    ],

    "IT Service Continuity Management": [
        "IT Service Continuity Management"
    ],

    "Data Resiliency": [
        "Data Resiliency"
    ]

};


/* =========================================================
   RESULT 2026
   NORMALIZE TEXT
========================================================= */

function normalizeResultText(value) {
    return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}


/* =========================================================
   RESULT 2026
   GET PROCESS OWNER
========================================================= */

function getResultProcessOwner(value) {
    const text =
        normalizeResultText(value);


    if (!text) {
        return null;
    }


    for (
        const [
            processName,
            aliases
        ]
        of Object.entries(
            RESULT_PROCESS_ALIASES
        )
    ) {

        const matched =
            aliases.some(
                alias =>
                    normalizeResultText(alias) ===
                    text
            );


        if (matched) {
            return processName;
        }

    }


    return null;
}


/* =========================================================
   RESULT 2026
   EMPTY ROW CHECK
========================================================= */

function isEmptyResultRow(row) {
    if (!Array.isArray(row)) {
        return true;
    }


    return row.every(
        value =>
            String(value ?? "")
                .trim() === ""
    );
}


/* =========================================================
   RESULT 2026
   BUILD PROCESS GROUPS
========================================================= */

function buildResultProcessGroups() {
    const data =
        getResultData();


    const groups = {};


    Object.keys(
        RESULT_PROCESS_ALIASES
    ).forEach(processName => {

        groups[processName] = [];

    });


    if (!data) {
        return groups;
    }


    let currentProcess = null;


    data.rows.forEach(row => {

        if (
            !Array.isArray(row) ||
            isEmptyResultRow(row)
        ) {
            return;
        }


        const firstColumn =
            row[0];


        const secondColumn =
            row[1];


        const processFromFirst =
            getResultProcessOwner(
                firstColumn
            );


        const processFromSecond =
            getResultProcessOwner(
                secondColumn
            );


        const detectedProcess =
            processFromFirst ||
            processFromSecond;


        if (detectedProcess) {
            currentProcess =
                detectedProcess;


            const remainingValues =
                row
                    .slice(2)
                    .some(
                        value =>
                            String(value ?? "")
                                .trim() !== ""
                    );


            if (!remainingValues) {
                return;
            }
        }


        if (currentProcess) {
            groups[currentProcess]
                .push(row);
        }

    });


    return groups;
}


/* =========================================================
   RESULT 2026
   LOAD PROCESS CARDS

   "2026 PERFORMANCE" SUDAH DIBUANG
========================================================= */

function loadResultProcessCards() {
    const grid =
        document.getElementById(
            "resultProcessGrid"
        );


    if (!grid) {
        return;
    }


    const processes =
        getProcessData();


    grid.innerHTML = "";


    if (processes.length === 0) {
        grid.innerHTML = `
            <div class="empty-process-message">
                No ITIL Process data found.
            </div>
        `;

        return;
    }


    processes.forEach(
        (process, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "process-card result-process-card";


            card.dataset.name =
                String(
                    process.name || ""
                ).toLowerCase();


            const icon =
                process.icon ||
                "fa-chart-column";


            card.innerHTML = `
                <div
                    class="process-icon result-card-icon"
                >
                    <i
                        class="fa-solid ${escapeHTML(icon)}"
                    ></i>
                </div>


                <div class="result-card-content">

                    <h3>
                        ${escapeHTML(
                            process.name
                        )}
                    </h3>


                    <p>
                        <strong>
                            ${escapeHTML(
                                process.count
                            )}
                        </strong>

                        KPI Group(s)
                    </p>

                </div>


                <button
                    type="button"
                    class="process-view-button result-view-button"
                    data-index="${index}"
                >
                    View Result

                    <i
                        class="fa-solid fa-arrow-right"
                    ></i>
                </button>
            `;


            const button =
                card.querySelector(
                    ".result-view-button"
                );


            button.addEventListener(
                "click",
                function () {

                    viewResultProcess(
                        process.name
                    );

                }
            );


            grid.appendChild(card);

        }
    );
}


/* =========================================================
   RESULT 2026
   PROCESS SEARCH
========================================================= */

function setupResultProcessSearch() {
    const input =
        document.getElementById(
            "resultProcessSearch"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const keyword =
                input.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    "#resultProcessGrid .result-process-card"
                );


            cards.forEach(card => {

                const name =
                    card.dataset.name || "";


                card.style.display =
                    name.includes(keyword)
                        ? "flex"
                        : "none";

            });

        }
    );
}


/* =========================================================
   RESULT 2026
   VIEW PROCESS
========================================================= */

function viewResultProcess(processName) {
    const data =
        getResultData();


    if (!data) {
        alert(
            "RESULT_2026 data was not found."
        );

        return;
    }


    const groups =
        buildResultProcessGroups();


    const rows =
        groups[processName] || [];


    const processList =
        document.getElementById(
            "resultProcessList"
        );


    const processDetail =
        document.getElementById(
            "resultProcessDetail"
        );


    const title =
        document.getElementById(
            "resultProcessTitle"
        );


    const count =
        document.getElementById(
            "resultProcessCount"
        );


    const tableTitle =
        document.getElementById(
            "resultTableTitle"
        );


    const iconBox =
        document.getElementById(
            "resultDetailIcon"
        );


    if (
        !processList ||
        !processDetail
    ) {
        return;
    }


    processList.style.display =
        "none";


    processDetail.style.display =
        "block";


    if (title) {
        title.textContent =
            processName;
    }


    if (count) {
        count.textContent =
            `KPI performance from January to December 2026 • ${rows.length} result row(s)`;
    }


    if (tableTitle) {
        tableTitle.textContent =
            `${processName} - KPI Result 2026`;
    }


    const process =
        getProcessData()
            .find(
                item =>
                    item.name ===
                    processName
            );


    if (iconBox) {
        const icon =
            process?.icon ||
            "fa-chart-column";


        iconBox.innerHTML = `
            <i
                class="fa-solid ${escapeHTML(icon)}"
            ></i>
        `;
    }


    renderResultProcessTable(
        data.headers,
        rows
    );


    const resultSearch =
        document.getElementById(
            "resultSearch"
        );


    if (resultSearch) {
        resultSearch.value = "";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   RESULT 2026
   RENDER RESULT TABLE
========================================================= */

function renderResultProcessTable(
    headers,
    rows
) {
    const tableHead =
        document.getElementById(
            "resultHead"
        );

    const tableBody =
        document.getElementById(
            "resultBody"
        );


    if (
        !tableHead ||
        !tableBody
    ) {
        return;
    }


    /*
       RESULT_2026:

       0  Process
       1  No
       2  ITIL Process & KPI 2026
       3  Report Frequency
       4  Target
       5  Stretch Target
       6  JAN
       7  FEB
       8  MAR
       9  APR
       10 MAY
       11 JUN
       12 JUL
       13 AUG
       14 SEP
       15 OCT
       16 NOV
       17 DEC
    */


    /* Buang Process column */
    const visibleHeaders =
        headers.slice(1);


    /* =====================================================
       TABLE HEADER
    ===================================================== */

    tableHead.innerHTML = `
        <tr>
            ${visibleHeaders
                .map(
                    (header, index) => {

                        let className = "";


                        if (index === 0) {
                            className =
                                "result-no-head";
                        }

                        else if (index === 1) {
                            className =
                                "result-kpi-head";
                        }

                        else if (index >= 5) {
                            className =
                                "result-month-head";
                        }


                        return `
                            <th class="${className}">
                                ${escapeHTML(header)}
                            </th>
                        `;
                    }
                )
                .join("")
            }
        </tr>
    `;


    tableBody.innerHTML = "";


    /* =====================================================
       EMPTY DATA
    ===================================================== */

    if (!rows || rows.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="${visibleHeaders.length}"
                    class="empty-table-cell"
                >
                    No result data available
                    for this process.
                </td>
            </tr>
        `;

        return;
    }


    /* =====================================================
       HELPER
    ===================================================== */

    function cleanValue(value) {

        return String(
            value ?? ""
        ).trim();
    }


    function displayValue(value) {

        const text =
            cleanValue(value);

        if (!text) {
            return "-";
        }

        return escapeHTML(text)
            .replaceAll(
                "\n",
                "<br>"
            );
    }


    /* =====================================================
       RENDER ROWS
    ===================================================== */

    let i = 0;


    while (i < rows.length) {

        const row =
            rows[i] || [];


        const no =
            cleanValue(row[1]);

        const kpi =
            cleanValue(row[2]);

        const frequency =
            cleanValue(row[3]);

        const target =
            cleanValue(row[4]);

        const stretch =
            cleanValue(row[5]);


        const hasMonthlyResult =
            row
                .slice(6)
                .some(
                    value =>
                        cleanValue(value) !== ""
                );


        /* =================================================
           GROUP / SUBHEADING
        ================================================= */

        const isSubHeading =
            no &&
            !kpi &&
            !frequency &&
            !target &&
            !stretch &&
            !hasMonthlyResult;


        if (isSubHeading) {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.className =
                "result-subheading-row";


            tr.innerHTML = `
                <td
                    colspan="${visibleHeaders.length}"
                >
                    <i
                        class="fa-solid fa-folder-open"
                    ></i>

                    ${escapeHTML(no)}
                </td>
            `;


            tableBody.appendChild(
                tr
            );


            i++;

            continue;
        }


        /* =================================================
           CHECK CONTINUATION ROWS

           Contoh Excel:

           4 | Number of reviews... | 1 time BCM
             |                      | 1 time ITSCM
             |                      | 1 time DR

           Semua row tanpa NO selepas row utama
           dianggap sambungan sehingga jumpa NO baru.
        ================================================= */

        let rowSpan = 1;


        if (no) {

            let nextIndex =
                i + 1;


            while (
                nextIndex < rows.length
            ) {

                const nextRow =
                    rows[nextIndex] || [];


                const nextNo =
                    cleanValue(
                        nextRow[1]
                    );


                /*
                   Jumpa nombor / ID KPI baru
                   = KPI baru, berhenti merge.
                */

                if (
                    nextNo !== "" &&
                    nextNo !== "-"
                ) {
                    break;
                }


                /*
                   Kalau process berubah,
                   jangan merge.
                */

                const currentProcess =
                    cleanValue(row[0]);


                const nextProcess =
                    cleanValue(
                        nextRow[0]
                    );


                if (
                    nextProcess &&
                    currentProcess &&
                    nextProcess !==
                        currentProcess
                ) {
                    break;
                }


                rowSpan++;

                nextIndex++;
            }
        }


        /* =================================================
           MAIN ROW
        ================================================= */

        const tr =
            document.createElement(
                "tr"
            );


        /*
           NO dan KPI menggunakan ROWSPAN.

           Jadi kalau KPI ada 3 sub-row:
           rowspan="3"
        */

        let html = `

            <td
                class="result-no-cell"
                rowspan="${rowSpan}"
            >
                ${
                    no
                        ? `
                            <span
                                class="number-badge"
                            >
                                ${displayValue(no)}
                            </span>
                        `
                        : "-"
                }
            </td>


            <td
                class="result-kpi-cell"
                rowspan="${rowSpan}"
            >
                ${displayValue(kpi)}
            </td>


            <td
                class="result-frequency-cell"
            >
                ${
                    frequency
                        ? `
                            <span
                                class="frequency-badge"
                            >
                                ${displayValue(
                                    frequency
                                )}
                            </span>
                        `
                        : "-"
                }
            </td>


            <td
                class="result-target-cell"
            >
                ${
                    target
                        ? `
                            <span
                                class="target-value"
                            >
                                ${displayValue(
                                    target
                                )}
                            </span>
                        `
                        : "-"
                }
            </td>


            <td
                class="result-stretch-cell"
            >
                ${
                    stretch
                        ? `
                            <span
                                class="stretch-value"
                            >
                                ${displayValue(
                                    stretch
                                )}
                            </span>
                        `
                        : "-"
                }
            </td>
        `;


        /* =================================================
           JAN - DEC MAIN ROW
        ================================================= */

        for (
            let monthIndex = 6;
            monthIndex <= 17;
            monthIndex++
        ) {

            const monthValue =
                cleanValue(
                    row[monthIndex]
                );


            html += `
                <td
                    class="
                        result-month-cell
                        ${
                            monthValue
                                ? ""
                                : "empty-result"
                        }
                    "
                >
                    ${displayValue(
                        monthValue
                    )}
                </td>
            `;
        }


        tr.innerHTML =
            html;


        tableBody.appendChild(
            tr
        );


        /* =================================================
           CONTINUATION ROWS

           PENTING:
           Tak render NO.
           Tak render KPI Name.

           Sebab kedua-duanya sudah rowspan.
        ================================================= */

        if (rowSpan > 1) {

            for (
                let j = 1;
                j < rowSpan;
                j++
            ) {

                const continuationRow =
                    rows[i + j] || [];


                const continuationTr =
                    document.createElement(
                        "tr"
                    );


                continuationTr.className =
                    "result-continuation-row";


                let continuationHTML = `

                    <td
                        class="result-frequency-cell"
                    >
                        ${
                            cleanValue(
                                continuationRow[3]
                            )
                                ? `
                                    <span
                                        class="frequency-badge"
                                    >
                                        ${displayValue(
                                            continuationRow[3]
                                        )}
                                    </span>
                                `
                                : "-"
                        }
                    </td>


                    <td
                        class="result-target-cell"
                    >
                        ${
                            cleanValue(
                                continuationRow[4]
                            )
                                ? `
                                    <span
                                        class="target-value"
                                    >
                                        ${displayValue(
                                            continuationRow[4]
                                        )}
                                    </span>
                                `
                                : "-"
                        }
                    </td>


                    <td
                        class="result-stretch-cell"
                    >
                        ${
                            cleanValue(
                                continuationRow[5]
                            )
                                ? `
                                    <span
                                        class="stretch-value"
                                    >
                                        ${displayValue(
                                            continuationRow[5]
                                        )}
                                    </span>
                                `
                                : "-"
                        }
                    </td>
                `;


                /* JAN - DEC continuation */

                for (
                    let monthIndex = 6;
                    monthIndex <= 17;
                    monthIndex++
                ) {

                    const monthValue =
                        cleanValue(
                            continuationRow[
                                monthIndex
                            ]
                        );


                    continuationHTML += `
                        <td
                            class="
                                result-month-cell
                                ${
                                    monthValue
                                        ? ""
                                        : "empty-result"
                                }
                            "
                        >
                            ${displayValue(
                                monthValue
                            )}
                        </td>
                    `;
                }


                continuationTr.innerHTML =
                    continuationHTML;


                tableBody.appendChild(
                    continuationTr
                );
            }
        }


        /*
           PENTING:
           Skip semua continuation row
           yang kita dah render.
        */

        i += rowSpan;
    }
}

/* =========================================================
   RESULT 2026
   BACK
========================================================= */

function closeResultProcess() {
    const processList =
        document.getElementById(
            "resultProcessList"
        );


    const processDetail =
        document.getElementById(
            "resultProcessDetail"
        );


    if (processList) {
        processList.style.display =
            "block";
    }


    if (processDetail) {
        processDetail.style.display =
            "none";
    }


    const resultSearch =
        document.getElementById(
            "resultSearch"
        );


    if (resultSearch) {
        resultSearch.value = "";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   RESULT 2026
   TABLE SEARCH
========================================================= */

function setupResultTableSearch() {
    const input =
        document.getElementById(
            "resultSearch"
        );


    const body =
        document.getElementById(
            "resultBody"
        );


    if (
        !input ||
        !body
    ) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const keyword =
                input.value
                    .toLowerCase()
                    .trim();


            const rows =
                body.querySelectorAll(
                    "tr"
                );


            rows.forEach(row => {

                const text =
                    row.innerText
                        .toLowerCase();


                row.style.display =
                    text.includes(keyword)
                        ? ""
                        : "none";

            });

        }
    );
}



/* =========================================================
   GENERIC SHEET RENDERER
   JAN-JUN / INC2026
========================================================= */

function renderSheet(
    data,
    headerID,
    bodyID
) {
    const tableHead =
        document.getElementById(
            headerID
        );


    const tableBody =
        document.getElementById(
            bodyID
        );


    if (
        !tableHead ||
        !tableBody
    ) {
        return;
    }


    if (
        !data ||
        !Array.isArray(data.headers) ||
        !Array.isArray(data.rows)
    ) {
        console.warn(
            `Data for ${bodyID} is unavailable.`
        );

        return;
    }


    tableHead.innerHTML = `
        <tr>
            ${data.headers
                .map(
                    header => `
                        <th>
                            ${escapeHTML(header)}
                        </th>
                    `
                )
                .join("")
            }
        </tr>
    `;


    if (data.rows.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="${data.headers.length}"
                    class="empty-table-cell"
                >
                    No data available.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        data.rows
            .map(
                row => `
                    <tr>

                        ${row
                            .map(
                                value => `
                                    <td>
                                        ${escapeHTML(
                                            value
                                        ).replaceAll(
                                            "\n",
                                            "<br>"
                                        )}
                                    </td>
                                `
                            )
                            .join("")
                        }

                    </tr>
                `
            )
            .join("");
}


/* =========================================================
   GENERIC TABLE SEARCH
========================================================= */

function setupTableSearch(
    inputID,
    bodyID
) {
    const input =
        document.getElementById(
            inputID
        );


    const body =
        document.getElementById(
            bodyID
        );


    if (
        !input ||
        !body
    ) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const keyword =
                input.value
                    .toLowerCase()
                    .trim();


            const rows =
                body.querySelectorAll(
                    "tr"
                );


            rows.forEach(row => {

                const text =
                    row.innerText
                        .toLowerCase();


                row.style.display =
                    text.includes(keyword)
                        ? ""
                        : "none";

            });

        }
    );
}


/* =========================================================
   OPEN OVERALL PROCESS FROM URL
========================================================= */

function openProcessFromURL() {
    const processGrid =
        document.getElementById(
            "processGrid"
        );


    if (!processGrid) {
        return;
    }


    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const processName =
        parameters.get(
            "process"
        );


    if (!processName) {
        return;
    }


    const processes =
        getProcessData();


    const index =
        processes.findIndex(
            process =>
                String(
                    process.name
                ).toLowerCase() ===
                String(
                    processName
                ).toLowerCase()
        );


    if (index !== -1) {
        viewProcess(index);
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           DASHBOARD
        ====================================================== */

        loadDashboard();


        /* =====================================================
           OVERALL ITIL KPI
        ====================================================== */

        loadProcessCards();

        setupProcessSearch();

        setupKPISearch();


        const backButton =
            document.getElementById(
                "backBtn"
            );


        if (backButton) {
            backButton.addEventListener(
                "click",
                closeProcess
            );
        }


        /* =====================================================
           KPI RESULT 2026
        ====================================================== */

        loadResultProcessCards();

        setupResultProcessSearch();

        setupResultTableSearch();


        const resultBackButton =
            document.getElementById(
                "resultBackBtn"
            );


        if (resultBackButton) {
            resultBackButton.addEventListener(
                "click",
                closeResultProcess
            );
        }


        /* =====================================================
           RESULT JAN - JUN
        ====================================================== */

        if (
            typeof RESULT_JANJUN !==
            "undefined"
        ) {
            renderSheet(
                RESULT_JANJUN,
                "janJunHead",
                "janJunBody"
            );
        }


        setupTableSearch(
            "janJunSearch",
            "janJunBody"
        );


        /* =====================================================
           INC 2026
        ====================================================== */

      /* =====================================================
   INC 2026
   BUANG COLUMN PROCESS
====================================================== */

if (
    typeof INC_2026 !== "undefined" &&
    INC_2026 &&
    Array.isArray(INC_2026.headers) &&
    Array.isArray(INC_2026.rows)
) {

    const incWithoutProcess = {
        headers: INC_2026.headers.slice(1),

        rows: INC_2026.rows.map(function (row) {
            return row.slice(1);
        })
    };

    renderSheet(
        incWithoutProcess,
        "incidentHead",
        "incidentBody"
    );
}

setupTableSearch(
    "incidentSearch",
    "incidentBody"
);

        /* =====================================================
           URL PROCESS
           RUN LAST
        ====================================================== */

        openProcessFromURL();

    }
);
/* =========================================================
   RESULT JAN - JUN 2026
   GROUPING IKUT DATA EXCEL / RESULT_JANJUN
========================================================= */


/* =========================================================
   PROCESS NAME
========================================================= */

const JAN_JUN_PROCESS_NAMES = {

    INC: "Incident Management",

    SR: "Service Request Management",

    KM: "Knowledge Management",

    AVL: "Availability Management",

    CAP: "Capacity Management",

    CPY: "Capacity Management",

    SLM: "SLM & BRM",

    BRM: "SLM & BRM",

    "SLM/BRM": "SLM & BRM",

    "SLM & BRM": "SLM & BRM",

    SEC: "IT Security Management",

    ITSEC: "IT Security Management",

    CHG: "Change & Release Management",

    REL: "Change & Release Management",

    CHGREL: "Change & Release Management",

    PRB: "Problem Management",

    SUP: "Supplier Management",

    CFG: "Configuration Management",

    FIN: "Financial Management",

    ITSCM: "IT Service Continuity Management",

    DR: "Data Resiliency"

};


/* =========================================================
   GET JAN JUN DATA
========================================================= */

function getJanJunData() {

    if (
        typeof RESULT_JANJUN === "undefined" ||
        !RESULT_JANJUN ||
        !Array.isArray(RESULT_JANJUN.headers) ||
        !Array.isArray(RESULT_JANJUN.rows)
    ) {

        console.error(
            "RESULT_JANJUN tidak dijumpai dalam data.js"
        );

        return null;

    }


    return RESULT_JANJUN;

}


/* =========================================================
   NORMAL TEXT
========================================================= */

function janJunText(value) {

    return String(
        value ?? ""
    )
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   CHECK BLANK
========================================================= */

function janJunIsBlank(value) {

    return (
        janJunText(value) === ""
    );

}


/* =========================================================
   CHECK EMPTY ROW
========================================================= */

function janJunRowIsEmpty(row) {

    if (!Array.isArray(row)) {

        return true;

    }


    return row.every(
        function (value) {

            return janJunIsBlank(value);

        }
    );

}


/* =========================================================
   GET PROCESS NAME
========================================================= */

function janJunProcessLabel(code) {

    const key =
        janJunText(code)
            .toUpperCase();


    return (
        JAN_JUN_PROCESS_NAMES[key] ||
        janJunText(code) ||
        "KPI Result"
    );

}


/* =========================================================
   DETECT GROUP HEADER FROM EXCEL

   Contoh group:
   - Service Availability
   - Service Performance
   - Network Availability Management
   - Data Availability
   - dan group lain dalam Excel
========================================================= */

function janJunIsGroupHeading(row) {

    if (!Array.isArray(row)) {
        return false;
    }

    const no = String(row[1] ?? "").trim();
    const name = String(row[2] ?? "").trim();
    const frequency = String(row[3] ?? "").trim();
    const target = String(row[4] ?? "").trim();
    const stretch = String(row[5] ?? "").trim();

    const hasMonthData = row
        .slice(6, 12)
        .some(function (value) {
            return (
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            );
        });

    return (
        /^\d+$/.test(no) &&
        name !== "" &&
        frequency === "" &&
        target === "" &&
        stretch === "" &&
        !hasMonthData
    );
}


/* =========================================================
   CLEAN GROUP NAME
========================================================= */

function janJunCleanGroupName(value) {

    let name =
        janJunText(value);


    /*
        Buang numbering depan sahaja.

        Contoh:

        1. Service Availability
        ->
        Service Availability

        3 - Network Availability Management
        ->
        Network Availability Management
    */

    name =
        name.replace(
            /^\d+\s*[\.\-\:\)]\s*/,
            ""
        );


    name =
        name.trim();


    return (
        name ||
        "KPI Group"
    );

}


/* =========================================================
   BUILD GROUPS FROM RESULT_JANJUN
========================================================= */

function buildJanJunGroups() {

    const data =
        getJanJunData();


    if (!data) {

        return [];

    }


    const groups = [];


    let currentProcessCode = "";

    let currentGroup = null;



    /* =====================================================
       CREATE GROUP
    ===================================================== */

    function createGroup(
        name,
        processCode
    ) {

        const group = {

            name:
                janJunCleanGroupName(
                    name
                ),

            processCode:
                janJunText(
                    processCode
                ),

            processName:
                janJunProcessLabel(
                    processCode
                ),

            rows: []

        };


        groups.push(group);


        return group;

    }



    /* =====================================================
       READ EVERY EXCEL ROW
    ===================================================== */

    data.rows.forEach(
        function (row) {


          if (janJunIsGroupHeading(row)) {

    currentGroup = createGroup(
        row[2],
        currentProcessCode
    );

    currentGroup.groupNo =
        String(row[1] ?? "").trim();

    return;
}


            /* =============================================
               PROCESS CODE
            ============================================== */

            const rowProcessCode =
                janJunText(
                    row[0]
                );


            if (
                rowProcessCode !== ""
            ) {

                currentProcessCode =
                    rowProcessCode;

            }



            /* =============================================
               GROUP HEADER
            ============================================== */

           if (janJunIsGroupHeading(row)) {

    currentGroup = createGroup(
        row[2],
        currentProcessCode
    );

    currentGroup.groupNo =
        String(row[1] ?? "").trim();

    return;
}


            /* =============================================
               NORMAL KPI ROW
            ============================================== */

            const kpi =
                janJunText(
                    row[2]
                );


            const frequency =
                janJunText(
                    row[3]
                );


            const target =
                janJunText(
                    row[4]
                );


            const stretch =
                janJunText(
                    row[5]
                );


            const hasMonths =
                row
                    .slice(6, 12)
                    .some(
                        function (value) {

                            return !janJunIsBlank(
                                value
                            );

                        }
                    );



            const isKpiRow = (

                kpi !== "" ||

                frequency !== "" ||

                target !== "" ||

                stretch !== "" ||

                hasMonths

            );


            if (!isKpiRow) {

                return;

            }



            /*
                INC / SR / KM mungkin terus mempunyai
                KPI rows tanpa subgroup heading.

                Jadi kita create card menggunakan
                nama process.
            */

            if (

                !currentGroup ||

                currentGroup.processCode !==
                    currentProcessCode

            ) {


                currentGroup =
                    createGroup(

                        janJunProcessLabel(
                            currentProcessCode
                        ),

                        currentProcessCode

                    );

            }



            currentGroup.rows.push(
                row
            );


        }
    );



    /* =====================================================
       REMOVE EMPTY GROUP
    ===================================================== */

    return groups.filter(
        function (group) {

            return (
                group.rows.length > 0
            );

        }
    );

}


/* =========================================================
   GROUP ICON
========================================================= */

function getJanJunGroupIcon(group) {

    const text = (

        group.name +

        " " +

        group.processName +

        " " +

        group.processCode

    )
        .toLowerCase();



    if (
        text.includes(
            "network"
        )
    ) {

        return "fa-network-wired";

    }



    if (
        text.includes(
            "security"
        )
    ) {

        return "fa-shield-halved";

    }



    if (
        text.includes(
            "incident"
        )
    ) {

        return "fa-triangle-exclamation";

    }



    if (
        text.includes(
            "availability"
        )
    ) {

        return "fa-server";

    }



    if (
        text.includes(
            "capacity"
        )
    ) {

        return "fa-chart-column";

    }



    if (
        text.includes(
            "performance"
        )
    ) {

        return "fa-gauge-high";

    }



    if (
        text.includes(
            "knowledge"
        )
    ) {

        return "fa-book";

    }



    if (
        text.includes(
            "service request"
        )
    ) {

        return "fa-ticket";

    }



    if (
        text.includes(
            "supplier"
        )
    ) {

        return "fa-handshake";

    }



    if (
        text.includes(
            "financial"
        )
    ) {

        return "fa-coins";

    }



    if (
        text.includes(
            "data"
        )
    ) {

        return "fa-database";

    }



    if (
        text.includes("change") ||
        text.includes("release")
    ) {

        return "fa-arrows-rotate";

    }



    if (
        text.includes(
            "configuration"
        )
    ) {

        return "fa-sitemap";

    }



    return "fa-chart-line";

}


/* =========================================================
   LOAD JAN JUN GROUP CARDS
========================================================= */

function loadJanJunGroupCards() {

    const grid =
        document.getElementById(
            "janJunProcessGrid"
        );


    if (!grid) {

        return;

    }



    const groups =
        buildJanJunGroups();



    grid.innerHTML = "";



    /* =====================================================
       NO GROUP
    ===================================================== */

    if (
        groups.length === 0
    ) {


        grid.innerHTML = `

            <div class="empty-process-message">

                No Jan - Jun KPI groups found.

            </div>

        `;


        return;

    }



    /* =====================================================
       CREATE CARD
    ===================================================== */

    groups.forEach(
        function (
            group,
            index
        ) {


            const card =
                document.createElement(
                    "article"
                );


            const icon =
                getJanJunGroupIcon(
                    group
                );



            card.className =
                "process-card jan-jun-process-card";



            card.dataset.name =
                (

                    group.name +

                    " " +

                    group.processName +

                    " " +

                    group.processCode

                )
                    .toLowerCase();



            card.innerHTML = `


                <div class="process-icon">


                    <i
                        class="fa-solid ${escapeHTML(icon)}"
                    ></i>


                </div>



                <div class="result-card-content">


                    <h3>

                        ${escapeHTML(group.name)}

                    </h3>



                    <p>

                        <strong>

                            ${group.rows.length}

                        </strong>

                        KPI Result(s)

                    </p>



                  

                </div>



                <button

                    type="button"

                    class="
                        process-view-button
                        jan-jun-view-button
                    "

                    data-index="${index}"

                >

                    View Result

                    <i
                        class="fa-solid fa-arrow-right"
                    ></i>

                </button>


            `;



            /* =============================================
               VIEW RESULT BUTTON
            ============================================== */

            const button =
                card.querySelector(
                    ".jan-jun-view-button"
                );



            if (button) {


                button.addEventListener(
                    "click",
                    function () {


                        viewJanJunGroup(
                            index
                        );


                    }
                );


            }



            grid.appendChild(
                card
            );


        }
    );

}


/* =========================================================
   VIEW SELECTED GROUP
========================================================= */

function viewJanJunGroup(index) {

    const groups =
        buildJanJunGroups();


    const group =
        groups[index];


    if (!group) {

        console.error(
            "Jan-Jun group not found:",
            index
        );

        return;

    }



    const list =
        document.getElementById(
            "janJunProcessList"
        );


    const detail =
        document.getElementById(
            "janJunProcessDetail"
        );


    if (
        !list ||
        !detail
    ) {

        return;

    }



    /* =====================================================
       CHANGE PAGE
    ===================================================== */

    list.style.display =
        "none";


    detail.style.display =
        "block";



    /* =====================================================
       TITLE
    ===================================================== */

    const title =
        document.getElementById(
            "janJunProcessTitle"
        );


    if (title) {

        title.textContent =
            group.name;

    }



    /* =====================================================
       KPI COUNT
    ===================================================== */

    const count =
        document.getElementById(
            "janJunProcessCount"
        );


    if (count) {

        count.textContent =

            group.rows.length +

            " KPI Result(s) • " +

            "January - June 2026";

    }



    /* =====================================================
       TABLE TITLE
    ===================================================== */

    const tableTitle =
        document.getElementById(
            "janJunTableTitle"
        );


    if (tableTitle) {

        tableTitle.textContent =

            group.name +

            " - Jan to Jun 2026";

    }



    /* =====================================================
       PROCESS CATEGORY
    ===================================================== */

    const category =
        document.getElementById(
            "janJunDetailCategory"
        );


    if (category) {

        category.textContent =

            group.processName +

            " • FIRST HALF 2026";

    }



    /* =====================================================
       ICON
    ===================================================== */

    const iconBox =
        document.getElementById(
            "janJunDetailIcon"
        );


    if (iconBox) {


        const icon =
            getJanJunGroupIcon(
                group
            );


        iconBox.innerHTML = `

            <i
                class="fa-solid ${escapeHTML(icon)}"
            ></i>

        `;

    }



    /* =====================================================
       RESET SEARCH
    ===================================================== */

    const search =
        document.getElementById(
            "janJunSearch"
        );


    if (search) {

        search.value = "";

    }



    /* =====================================================
       RENDER TABLE
    ===================================================== */

    renderJanJunGroupTable(
        group.rows
    );



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   FORMAT JAN JUN VALUE
========================================================= */

function janJunDisplayValue(value) {

    if (

        value === null ||

        value === undefined ||

        String(value).trim() === ""

    ) {

        return "-";

    }



    /* =====================================================
       NUMBER FROM EXCEL
    ===================================================== */

    if (
        typeof value === "number"
    ) {


        /*
            0.994
            ->
            99.40%
        */

        if (
            value > 0 &&
            value < 1
        ) {

            return (

                value * 100

            ).toFixed(2) + "%";

        }



        /*
            1
            ->
            100%
        */

        if (
            value === 1
        ) {

            return "100%";

        }

    }



    return String(value);

}


/* =========================================================
   RENDER GROUP TABLE
========================================================= */

function renderJanJunGroupTable(
    rows
) {

    const head =
        document.getElementById(
            "janJunHead"
        );


    const body =
        document.getElementById(
            "janJunBody"
        );


    if (
        !head ||
        !body
    ) {

        return;

    }



    /* =====================================================
       TABLE HEADER
    ===================================================== */

    const headers = [

        "No.",

        "ITIL Process & KPI 2026",

        "Report Frequency",

        "Target",

        "Stretch Target",

        "JAN",

        "FEB",

        "MAR",

        "APR",

        "MAY",

        "JUN"

    ];



    head.innerHTML = `

        <tr>

            ${

                headers

                    .map(
                        function (header) {

                            return `

                                <th>

                                    ${escapeHTML(header)}

                                </th>

                            `;

                        }
                    )

                    .join("")

            }

        </tr>

    `;



    body.innerHTML = "";



    /* =====================================================
       NO DATA
    ===================================================== */

    if (
        !Array.isArray(rows) ||
        rows.length === 0
    ) {


        body.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    class="empty-table-cell"
                >

                    No Jan - Jun result
                    available for this KPI group.

                </td>

            </tr>

        `;


        return;

    }



    /* =====================================================
       DATA ROWS
    ===================================================== */

    rows.forEach(
        function (row) {


            const tr =
                document.createElement(
                    "tr"
                );



            /*
                row[0] = Process
                row[1] = No
                row[2] = KPI
                row[3] = Frequency
                row[4] = Target
                row[5] = Stretch
                row[6] = JAN
                row[7] = FEB
                row[8] = MAR
                row[9] = APR
                row[10] = MAY
                row[11] = JUN
            */


            const values =
                row.slice(
                    1,
                    12
                );



            tr.innerHTML =

                values

                    .map(
                        function (
                            value,
                            index
                        ) {


                            const original =
                                janJunDisplayValue(
                                    value
                                );


                            const display =
                                escapeHTML(
                                    original
                                )
                                    .replaceAll(
                                        "\n",
                                        "<br>"
                                    );



                            /* =====================================
                               NO
                            ====================================== */

                            if (
                                index === 0
                            ) {


                                if (
                                    original === "-"
                                ) {

                                    return `

                                        <td
                                            class="result-no-cell"
                                        >
                                            -
                                        </td>

                                    `;

                                }


                                return `

                                    <td
                                        class="result-no-cell"
                                    >

                                        <span
                                            class="number-badge"
                                        >

                                            ${display}

                                        </span>

                                    </td>

                                `;

                            }



                            /* =====================================
                               KPI NAME
                            ====================================== */

                            if (
                                index === 1
                            ) {

                                return `

                                    <td
                                        class="result-kpi-cell"
                                    >

                                        ${display}

                                    </td>

                                `;

                            }



                            /* =====================================
                               FREQUENCY
                            ====================================== */

                            if (
                                index === 2
                            ) {


                                if (
                                    original === "-"
                                ) {

                                    return `

                                        <td
                                            class="result-frequency-cell"
                                        >
                                            -
                                        </td>

                                    `;

                                }


                                return `

                                    <td
                                        class="result-frequency-cell"
                                    >

                                        <span
                                            class="frequency-badge"
                                        >

                                            ${display}

                                        </span>

                                    </td>

                                `;

                            }



                            /* =====================================
                               TARGET
                            ====================================== */

                            if (
                                index === 3
                            ) {


                                if (
                                    original === "-"
                                ) {

                                    return `

                                        <td
                                            class="result-target-cell"
                                        >
                                            -
                                        </td>

                                    `;

                                }


                                return `

                                    <td
                                        class="result-target-cell"
                                    >

                                        <span
                                            class="target-value"
                                        >

                                            ${display}

                                        </span>

                                    </td>

                                `;

                            }



                            /* =====================================
                               STRETCH TARGET
                            ====================================== */

                            if (
                                index === 4
                            ) {


                                if (
                                    original === "-"
                                ) {

                                    return `

                                        <td
                                            class="result-stretch-cell"
                                        >
                                            -
                                        </td>

                                    `;

                                }


                                return `

                                    <td
                                        class="result-stretch-cell"
                                    >

                                        <span
                                            class="stretch-value"
                                        >

                                            ${display}

                                        </span>

                                    </td>

                                `;

                            }



                            /* =====================================
                               JAN - JUN
                            ====================================== */

                            return `

                                <td
                                    class="
                                        result-month-cell
                                        ${
                                            original === "-"
                                                ? "empty-result"
                                                : ""
                                        }
                                    "
                                >

                                    ${display}

                                </td>

                            `;


                        }
                    )

                    .join("");



            body.appendChild(
                tr
            );


        }
    );

}


/* =========================================================
   BACK TO KPI GROUP
========================================================= */

function closeJanJunGroup() {

    const list =
        document.getElementById(
            "janJunProcessList"
        );


    const detail =
        document.getElementById(
            "janJunProcessDetail"
        );


    const search =
        document.getElementById(
            "janJunSearch"
        );



    if (detail) {

        detail.style.display =
            "none";

    }



    if (list) {

        list.style.display =
            "block";

    }



    if (search) {

        search.value = "";

    }



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   SEARCH KPI GROUP
========================================================= */

function setupJanJunProcessSearch() {

    const input =
        document.getElementById(
            "janJunProcessSearch"
        );


    const grid =
        document.getElementById(
            "janJunProcessGrid"
        );


    if (
        !input ||
        !grid
    ) {

        return;

    }



    input.addEventListener(
        "input",
        function () {


            const keyword =
                input.value
                    .toLowerCase()
                    .trim();



            const cards =
                grid.querySelectorAll(
                    ".jan-jun-process-card"
                );



            cards.forEach(
                function (card) {


                    const text =
                        card.dataset.name ||
                        "";


                    card.style.display =

                        text.includes(
                            keyword
                        )

                            ? ""

                            : "none";


                }
            );


        }
    );

}


/* =========================================================
   SEARCH KPI RESULT
========================================================= */

function setupJanJunTableSearch() {

    const input =
        document.getElementById(
            "janJunSearch"
        );


    const body =
        document.getElementById(
            "janJunBody"
        );


    if (
        !input ||
        !body
    ) {

        return;

    }



    input.addEventListener(
        "input",
        function () {


            const keyword =
                input.value
                    .toLowerCase()
                    .trim();



            const rows =
                body.querySelectorAll(
                    "tr"
                );



            rows.forEach(
                function (row) {


                    const text =
                        row.innerText
                            .toLowerCase();


                    row.style.display =

                        text.includes(
                            keyword
                        )

                            ? ""

                            : "none";


                }
            );


        }
    );

}


/* =========================================================
   INITIALIZE JAN JUN PAGE
========================================================= */

function initJanJunPage() {

    const grid =
        document.getElementById(
            "janJunProcessGrid"
        );


    /*
        Kalau bukan jan-jun.html,
        function berhenti di sini.
    */

    if (!grid) {

        return;

    }



    /* =====================================================
       LOAD EXCEL GROUPS
    ===================================================== */

    loadJanJunGroupCards();



    /* =====================================================
       SEARCH GROUP
    ===================================================== */

    setupJanJunProcessSearch();



    /* =====================================================
       SEARCH TABLE
    ===================================================== */

    setupJanJunTableSearch();



    /* =====================================================
       BACK BUTTON
    ===================================================== */

    const backButton =
        document.getElementById(
            "janJunBackBtn"
        );


    if (backButton) {


        backButton.addEventListener(

            "click",

            closeJanJunGroup

        );


    }



    /* =====================================================
       DEFAULT VIEW
    ===================================================== */

    const list =
        document.getElementById(
            "janJunProcessList"
        );


    const detail =
        document.getElementById(
            "janJunProcessDetail"
        );



    if (list) {

        list.style.display =
            "block";

    }



    if (detail) {

        detail.style.display =
            "none";

    }

}


/* =========================================================
   RUN JAN JUN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initJanJunPage();

    }
);