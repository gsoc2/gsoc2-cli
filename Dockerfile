ARG BUILD_ARCH=x86_64
ARG BUILD_LIBC=musl
FROM messense/rust-musl-cross:$BUILD_ARCH-$BUILD_LIBC AS gsoc2-build

ARG BUILD_ARCH
ARG BUILD_LIBC
ENV BUILD_TARGET=$BUILD_ARCH-unknown-linux-$BUILD_LIBC
WORKDIR /work

# Build only dependencies to speed up subsequent builds
COPY Cargo.toml Cargo.lock build.rs ./
RUN mkdir -p src \
    && echo "fn main() {}" > src/main.rs \
    && cargo build --release --target=$BUILD_TARGET --locked

# Add all sources and rebuild the actual gsoc2-cli
COPY src src/

RUN touch src/main.rs && cargo build --target=$BUILD_TARGET --release --features managed

# Copy the compiled binary to a target-independent location so it can be picked up later
RUN cp target/$BUILD_TARGET/release/gsoc2-cli /usr/local/bin/gsoc2-cli

FROM alpine:3.14
WORKDIR /work
RUN apk add --no-cache ca-certificates
COPY ./docker-entrypoint.sh /
COPY --from=gsoc2-build /usr/local/bin/gsoc2-cli /bin
ENTRYPOINT ["/docker-entrypoint.sh"]
