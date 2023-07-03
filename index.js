const express = require("express");
const app = express();
const pool = require("./db");
var cors = require("cors");

app.use(express.json());
app.use(cors());

app.post("/reading", async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

        const {
            temperature,
            humidity,
            pressure,
            light,
            particles,
            windSpeed,
            windDirection,
            rain,
        } = req.body;
        let data = [];
        data.push(
            temperature.toFixed(2),
            humidity.toFixed(2),
            pressure.toFixed(2),
            light.toFixed(2),
            particles.toFixed(2),
            windSpeed.toFixed(2),
            rain.toFixed(2),
            windDirection
        );

        const newReading = await pool.query(
            `INSERT INTO "reading" ("temperature", "humidity", "pressure", "light", "particles", "windspeed", "rain", "winddirection") VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
            data
        );
        return res.json(newReading.rows);
    } catch (error) {
        console.log(error);
    }
});

app.get("/latest-reading", async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

        const newReading = await pool.query(
            `SELECT id, temperature, humidity, pressure, light, particles, windspeed, rain, winddirection, datecreated
            FROM public.reading order by datecreated desc limit 1`
        );
        res.json(newReading.rows);
    } catch (error) {
        console.log(error);
    }
});

app.get("/find-reading", async (req, res) => {
    try {
        const { page, rpp, sortOrder, dateLowerLimit, dateUpperLimit } =
            req.query;

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

        let orderQuery = sortOrder;
        let offsetQuery = (page - 1) * rpp;
        let dateQuery = null;

        if (dateLowerLimit !== "null" && dateUpperLimit !== "null") {
            dateQuery = `WHERE datecreated > '${dateLowerLimit}' AND datecreated < '${dateUpperLimit}' `;
        } else if (dateLowerLimit !== "null") {
            dateQuery = `WHERE datecreated > '${dateLowerLimit}' `;
        } else if (dateUpperLimit !== "null") {
            dateQuery = `WHERE datecreated < '${dateUpperLimit}' `;
        }

        const newReading = await pool.query(
            `SELECT *
            FROM public.reading ${
                dateQuery !== null ? dateQuery : ""
            } order by datecreated ${orderQuery} LIMIT ${rpp} OFFSET ${offsetQuery}`
        );

        const rowCount = await pool.query(
            `SELECT Count(*)
            FROM public.reading ${dateQuery !== null ? dateQuery : ""}`
        );
        let count = rowCount.rows;
        res.json({ values: [...newReading.rows], count });
    } catch (error) {
        console.log(error);
    }
});

// get latest

app.listen(process.env.PORT || 9000, () => {
    console.log(`server is listening on port ${process.env.PORT || 9000}`);
});
