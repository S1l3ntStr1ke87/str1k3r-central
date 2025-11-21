import { createServer } from "node:http";
import { fileURLToPath } from "url";
import { hostname } from "node:os";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { scramjetPath } from "@mercuryworkshop/scramjet/path";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const sjpublicpath = fileURLToPath(new URL("../public/", import.meta.url));

// Wisp Configuration: Refer to the documentation at https://www.npmjs.com/package/@mercuryworkshop/wisp-js

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
  allow_udp_streams: false,
  hostname_blacklist: [
  /pornhub\.com/,
  /pornhub\.xxx/,
  /xvideos\.com/,
  /xhamster\.com/,
  /xnxx\.com/,
  /youporn\.com/,
  /redtube\.com/,
  /tube8\.com/,
  /spankbang\.com/,
  /spankwire\.com/,
  /tnaflix\.com/,
  /drtuber\.com/,
  /fapdu\.com/,
  /youjizz\.com/,
  /youporn\.xxx/,
  /porn\.com/,
  /xgroovy\.com/,
  /pornhat\.com/,
  /superporn\.com/,
  /justporn\.com/,
  /tik\.porn/,
  /hello\.porn/,
  /redporn\.porn/,
  /theporndude\.com/,
  /eporner\.com/,
  /pornone\.com/,
  /pornhd\.com/,
  /porn300\.com/,
  /pornkai\.com/,
  /porndig\.com/,
  /pornmilo\.com/,
  /pornhup\.net/,
  /pornotube\.com/,
  /hotmovs\.com/,
  /fapster\.xxx/,
  /slutload\.com/,
  /anysex\.com/,
  /hdporn\.net/,
  /hdzog\.com/,
  /xozilla\.com/,
  /xxxdan\.com/,
  /xxxmoviestube\.com/,
  /4tube\.com/,
  /tubegalore\.com/,
  /extremetube\.com/,
  /hclips\.com/,
  /cliphunter\.com/,
  /porndoe\.com/,
  /upornia\.com/,
  /pornjam\.com/,
  /pornve\.com/,
  /spankbang\.party/,
  /fapvid\.com/,
  /sex\.com/,
  /porntrex\.com/,
  /xvides\.com/,
  /xxxbunker\.com/,
  /wetplace\.com/,
  /cam4\.com/,
  /stripchat\.com/,
  /chaturbate\.com/,
  /bongacams\.com/,
  /livejasmin\.com/,
  /myfreecams\.com/,
  /camwhores\.tv/,
  /camwhoresbay\.com/,
  /xlovecam\.com/,
  /camsoda\.com/,
  /camster\.com/,
  /camvideos\.tv/,
  /nudogram\.com/,
  /beeg\.com/,
  /beeg\.porn/,
  /milf\.porn/,
  /teenporn\.xxx/,
  /lesbianporn\.xxx/,
  /gayporn\.xxx/,
  /javhub\.net/,
  /javlibrary\.com/,
  /javhd\.com/,
  /jav\.gg/,
  /erome\.com/,
  /x18\.xyz/,
  /pornzog\.com/,
  /sexvid\.xxx/,
  /xxxvideo\.one/,
  /xxxvideos\.fun/,
  /xxxtube\.xxx/,
  /freeporn\.xxx/,
  /pornhentai\.net/,
  /rule34\.xxx/,
  /rule34video\.com/,
  /nhentai\.net/,
  /hentaihaven\.xxx/,
  /hentai\.xxx/,
  /faphouse\.com/,
  /adulttime\.com/,
  /brazzers\.com/,
  /naughtyamerica\.com/,
  /bangbros\.com/,
  /realitykings\.com/,
  /mofos\.com/,
  /teamskeet\.com/,
  /babes\.com/,
  /twistys\.com/,
  /digitalplayground\.com/,
  /evilangel\.com/,
  /joysporn\.com/,
  /lubed\.com/,
  /ftvgirls\.com/,
  /pornstarslikeitbig\.com/,
  /fakehub\.com/,
  /fakeagent\.com/,
  /metart\.com/,
  /xart\.com/,
  /wearehairy\.com/,
  /joymii\.com/,
  /hegre\.com/,
  /wowgirls\.com/,
  /wowporn\.com/,
  /passion-hd\.com/,
  /bellesa\.co/,
  /bellesa\.com/,
  /onlyfans\.com/,
  /fuq\.com/,
  /tubepleasure\.com/,
],
  dns_servers: ["1.1.1.1", "1.0.0.1"]
});

const fastify = Fastify({
	serverFactory: (handler) => {
		return createServer()
			.on("request", (req, res) => {
				//res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
				//res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
				handler(req, res);
			})
			.on("upgrade", (req, socket, head) => {
				if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
				else socket.end();
			});
	},
});

fastify.register(fastifyStatic, {
	root: sjpublicpath,
	decorateReply: true,
});

fastify.get("/uv/uv.config.js", (req, res) => {
	return res.sendFile("/uv/uv.config.js", sjpublicpath);
});

fastify.register(fastifyStatic, {
	root: uvPath,
	prefix: "/uv/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
  root: scramjetPath,
  prefix: "/scram/",
  decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: epoxyPath,
	prefix: "/epoxy/",
	decorateReply: false,
});

fastify.register(fastifyStatic, {
	root: baremuxPath,
	prefix: "/baremux/",
	decorateReply: false,
});

fastify.setNotFoundHandler((res, reply) => {
	return reply.code(404).type('text/html').sendFile('404.html');
})

fastify.server.on("listening", () => {
	const address = fastify.server.address();

	// by default we are listening on 0.0.0.0 (every interface)
	// we just need to list a few
	console.log("Listening on:");
	console.log(`\thttp://localhost:${address.port}`);
	console.log(`\thttp://${hostname()}:${address.port}`);
	console.log(
		`\thttp://${
			address.family === "IPv6" ? `[${address.address}]` : address.address
		}:${address.port}`
	);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
	console.log("SIGTERM signal received: closing HTTP server");
	fastify.close();
	process.exit(0);
}

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

fastify.listen({
	port: port,
	host: "0.0.0.0",
});
