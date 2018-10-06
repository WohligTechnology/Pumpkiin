server {
	listen 443 ssl;
	server_name pumpkiin.com;
	ssl_certificate /etc/letsencrypt/live/pumpkiin.com/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/pumpkiin.com/privkey.pem;
	location /api {
		proxy_pass http://127.0.0.1:82;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
	location / {
		proxy_pass http://127.0.0.1:82;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
	location /backend {
		root /home/admin/Pumpkiin;
		index index.html index.htm;
	}
}
server {
	listen 80;
	server_name pumpkiin.com;
	return 301 https://pumpkiin.com$request_uri;
}