#!/usr/bin/env bash

## Configuration ##
WEBSERVER="apache2" # apache2 or nginx

TEMPLATE_DIR="/vagrant/templates" # dir where all template files are.

SYMFONY_APP_DIR="/vagrant/app"
SYMFONY_CONFIG_DIR="$SYMFONY_APP_DIR/config"

VAGRANT_USER="vagrant"

# Just for cosmetic purposes
SSH_PORT=2222
## End Of Configuration ##


PROVISION_START=`date +%s`
echo "Starting to provision: $(date)"

cd /vagrant
HTTPS_PORT=`grep -o 'config.vm.network.*guest: 443.*' Vagrantfile | sed -E 's/.*guest: 443, host: ([0-9]+).*/\1/'`

echo "Appending to hosts file"
echo '127.0.0.1 korobi.dev' >> /etc/hosts

echo "Adding ruby PPA.."
apt-add-repository ppa:brightbox/ruby-ng -y

echo "Adding key for MongoDB.."
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list

echo "Adding dotdeb key for PHP.."
wget --quiet https://www.dotdeb.org/dotdeb.gpg
apt-key add dotdeb.gpg
rm dotdeb.gpg

DEB_VERSION=$(cat /etc/debian_version | grep -o -E '^[^/]+')

echo "Adding dotdeb packages to sources.list for OS: ${DEB_VERSION}"
echo "" >> /etc/apt/sources.list
echo "deb http://packages.dotdeb.org ${DEB_VERSION} all" >> /etc/apt/sources.list
echo "deb-src http://packages.dotdeb.org ${DEB_VERSION} all" >> /etc/apt/sources.list

echo "Updating packages.."
apt-get update -y -q && apt-get upgrade -y -q

if [[ $WEBSERVER == "apache2" ]]; then
    PHP_EXTRAS=""
elif [[ $WEBSERVER == "nginx" ]]; then
    PHP_EXTRAS="php5-fpm"
else
    PHP_EXTRAS=""
fi

apt-get install mongodb-org php5 php5-cli php5-curl php5-mcrypt php5-mongo openssl ruby2.1 nodejs npm git $PHP_EXTRAS $WEBSERVER -y -q

echo "Installing composer.."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/bin/composer

echo "Getting PHPUnit.."
wget --quiet https://phar.phpunit.de/phpunit.phar
mv phpunit.phar /usr/bin/phpunit

echo "Installing bundler & ruby project dependencies.."
gem install bundler scss
sudo -i -u $VAGRANT_USER bundle install --path=/vagrant --gemfile=/vagrant/Gemfile


echo "Installing nodejs project dependencies.."
npm install -g uglify-js

echo "Symlinking /vagrant to /home/vagrant"
ln -s /vagrant /home/vagrant/korobi-web

echo "Copying params.yml.."
cp "$TEMPLATE_DIR/symfony_params.yml" "$SYMFONY_CONFIG_DIR/parameters.yml"

cd /vagrant
echo "Running composer install.."
sudo -i -u $VAGRANT_USER composer install -d /vagrant --no-interaction

echo "Starting mongod.."
service mongod start

echo "Creating databases.." # TODO
echo "NYI"
# mongoimport --db korobi --collection channels --file "$TEMPLATE_DIR/channels.json" --jsonArray
# mongoimport --db korobi --collection chat_indexes --file "$TEMPLATE_DIR/chat_indexes.json" --jsonArray
# mongoimport --db korobi --collection chats  --file "$TEMPLATE_DIR/chats.json" --jsonArray
# mongoimport --db korobi --collection networks --file "$TEMPLATE_DIR/networks.json" --jsonArray

echo "Populating databases with dummy data.." # TODO
echo "NYI"

echo "Creating configuration for $WEBSERVER.."
if [[ $WEBSERVER == 'apache2' ]]; then
    FPREFIX="apache"
    WEBDIR="/etc/apache2"
    SITEDIR="$WEBDIR/sites-available"
    ENDIR="$WEBDIR/sites-enabled"
    SSL_DIR="$WEBDIR/ssl"

    a2enmod ssl
    a2enmod rewrite
else
    FPREFIX="nginx"
    WEBDIR="/etc/nginx"
    SITEDIR="$WEBDIR/sites-available"
    ENDIR="$WEBDIR/sites-enabled"
    SSL_DIR="$WEBDIR/ssl"
fi

# cp "$TEMPLATE_DIR/$FPREFIX.conf" "$WEBDIR/$FPREFIX.conf"
SSL_SAFE_DIR=$(echo $SSL_DIR | sed 's/\//\\\//g')
cat "$TEMPLATE_DIR/${FPREFIX}_site.conf" | sed -E "s/%ssl_dir%/$SSL_SAFE_DIR/" > "$SITEDIR/${FPREFIX}_site.conf"

echo "Generating files for local SSL.."
mkdir -p $SSL_DIR
cd $SSL_DIR
openssl req \
    -new \
    -newkey rsa:4096 \
    -days 3650 \
    -nodes \
    -x509 \
    -subj "/C=CA/ST=British Columbia/L=Vancouver/O=Korobi/OU=Web Development/CN=korobi.dev" \
    -keyout korobi.key \
    -out korobi.crt

echo "Enabling site for webserver.."
ln -s "$SITEDIR/${FPREFIX}_site.conf" "$ENDIR/${FPREFIX}_site.conf"

echo "Restarting $WEBSERVER.."
service $WEBSERVER restart

cd /vagrant/app
echo "Running tests in $(pwd).."
sudo -i -u $VAGRANT_USER phpunit .

PROVISION_END=`date +%s`
echo "Provisioning ended: $(date)"
echo "Time taken: $(($PROVISION_END - $PROVISION_START)) seconds"
echo
echo "Done!"
echo "Connect to SSH via vagrant@localhost:${SSH_PORT} or visit the page on https://localhost:${HTTPS_PORT} or https://korobi.dev:${HTTPS_PORT}"

function cleanup() {  # TODO - actually use it somewhere
    echo "Cleanup check: Composer"
    if [[ -e /vagrant/vendor ]]; then
        rm -rv /vagrant/vendor
    fi

    echo -e "Done!\nCleanup check: npm"
    if [[ -e /vagrant/node_modules/ ]]; then
        rm -rv /vagrant/node_modules
    fi

    if [[ -e /vagrant/npm-debug.log ]]; then
        rm -v /vagrant/npm-debug.log
    fi

    echo -e "Done!\nCleanup check: binaries"
    if [[ -e /vagrant/bin ]]; then
        rm -rv /vagrant/bin
    fi

    echo -e "Done!\nCleanup check: Symfony parameters.yml"
    if [[ -e /vagrant/app/config/parameters.yml ]]; then
        rm -v /vagrant/app/config/parameters.yml
    fi

    echo -e "Done!\nCleanup check: Symfony cache"
    if [[ -e /vagrant/app/bootstrap.php.cache ]]; then
        rm -v /vagrant/app/bootstrap.php.cache
    fi
    echo "Done!"
}
