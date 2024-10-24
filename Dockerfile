# Use the official PostgreSQL image as a parent image
FROM postgres:17

# Set environment variables
ENV PGVECTOR_VERSION v0.5.0

# Install build dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  build-essential \
  git \
  postgresql-server-dev-$PG_MAJOR \
  && rm -rf /var/lib/apt/lists/*

# Clone and install pgvector
RUN git clone --branch ${PGVECTOR_VERSION} https://github.com/pgvector/pgvector.git \
  && cd pgvector \
  && make \
  && make install \
  && cd .. \
  && rm -rf pgvector

# Add pgvector to shared_preload_libraries
RUN echo "shared_preload_libraries = 'vector'" >> /usr/share/postgresql/postgresql.conf.sample

# Cleanup
RUN apt-get remove -y \
  build-essential \
  git \
  postgresql-server-dev-$PG_MAJOR \
  && apt-get autoremove -y \
  && apt-get clean

# Switch back to the postgres user
USER postgres

# Add a script to create the extension when the container starts
COPY ./create_extension.sh /docker-entrypoint-initdb.d/
