FROM redis:3

# RUN sed 's/^daemonize yes/daemonize no/' -i /etc/conf/redis/redis.conf \
#   && sed 's/^bind 127.0.0.1/bind 0.0.0.0/' -i /etc/conf/redis/redis.conf

CMD redis-server --appendonly yes
