#!/bin/bash

# run this in ubuntu

# verify file function
verify_file () {
  app_file=$1
  checksum_file="$app_file.CHECKSUM"
  echo "hashing..."
  sha256sum $app_file > $checksum_file
  echo "$checksum_file is generated"
  echo "verify checksum file"
  sha256sum -c $checksum_file 2>&1 | grep OK
  printf "\n"
}


# read version number from cli, e.g. 0.1.0
if [ $# -eq 0 ]
  then
    echo "version number is required. e.g ./sha256.sh 0.0.1"
    exit 1
fi

version_number=$1

# enter building directory
cd dist

# hashing windows .exe file
# Please remove the space first, otherwise it's hell to handle spaces
app_file="RSAKeyGenerator-Setup-$version_number.exe"
#verify_file $app_file

#hashing MacOS dmg file
dmg_file="RSAKeyGenerator-$version_number-universal.dmg"
verify_file $dmg_file

# hashing Linux AppImage file
appimage_file="RSAKeyGenerator-$version_number.AppImage"
verify_file $appimage_file
