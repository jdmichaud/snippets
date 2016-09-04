ifeq ($(PLATFORMIO_UPLOAD_PORT),)
$(error PLATFORMIO_UPLOAD_PORT is unset. Set it to the Pololu device, the lowest one)
endif

all:
	platformio run -e pololu -t upload
