const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:3101";
const workerOrigin = process.env.WORKER_ORIGIN ?? "http://localhost:3102";
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3100";
const skipWeb = process.env.SMOKE_SKIP_WEB === "1";
const skipWorker = process.env.SMOKE_SKIP_WORKER === "1";

async function check(name, url, predicate) {
  const response = await fetch(url);
  const body = await response.json();
  if (!predicate(response, body)) {
    throw new Error(`${name} failed: ${response.status} ${JSON.stringify(body)}`);
  }
  console.log(JSON.stringify({ ok: true, name, url, status: response.status }));
}

async function main() {
  await check("api_live", `${apiOrigin}/health/live`, (res, body) =>
    res.ok && body.status === "live",
  );
  await check("api_ready", `${apiOrigin}/health/ready`, (res, body) =>
    res.ok && body.status === "ready",
  );

  if (!skipWorker) {
    await check("worker_live", `${workerOrigin}/health/live`, (res, body) =>
      res.ok && body.status === "live",
    );
  }

  if (!skipWeb) {
    const response = await fetch(webOrigin);
    if (!response.ok) {
      throw new Error(`web failed: ${response.status}`);
    }
    console.log(JSON.stringify({ ok: true, name: "web", url: webOrigin, status: response.status }));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
