# To allow 'make deploy_local' to run without password prompts,
# add the following line to /etc/sudoers (replace 'username' with your actual username):
# username ALL=(ALL) NOPASSWD: /bin/mkdir, /bin/cp

deploy_local_target_dir ?= /var/www/html/my-chatgpt-profile
target_dir = target

# doc in local.example.config
-include local.config

.PHONY: deploy_local deploy_production

deploy_local: package
	sudo mkdir -p $(deploy_local_target_dir)
	sudo cp -r $(target_dir)/* $(deploy_local_target_dir)/

clean:
	rm -rf $(target_dir)
	
package: clean
	mkdir -p $(target_dir)
	cp -r main/* $(target_dir)/

debug_production:
	@echo "Production SSH User: $(prodction_ssh_user)"
	@echo "Production SSH Host: $(prodction_ssh_host)"
	@echo "Production Directory: $(production_directory)"
	@echo "Production SSH Key: $(prodction_ssh_key)"
	ssh -i $(prodction_ssh_key) $(prodction_ssh_user)@$(prodction_ssh_host) "ls -la .; pwd; rsync --version"

deploy_production: package
	echo "Uploading files from $(target_dir)/ to $(production_directory)"
	rsync -avz --delete -e "ssh -i $(prodction_ssh_key)" $(target_dir)/ $(prodction_ssh_user)@$(prodction_ssh_host):$(production_directory)/
	