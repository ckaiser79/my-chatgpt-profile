deploy_local_target_dir ?= /var/www/html/my-chatgpt-profile

.PHONY: deploy_local

deploy_local:
	sudo mkdir -p $(deploy_local_target_dir)
	sudo cp -r main/* $(deploy_local_target_dir)/

-include local.config