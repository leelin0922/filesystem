# filesystem

Examples:copy git source from yocto git source

mkdir filesystem

cd filesystem

git init

echo "first commit" > README.md

git add .

git commit -m "first commit"

git remote add SBC-7119S_filesystem-4.9.88 https://github.com/leelin0922/filesystem.git

git fetch https://github.com/leelin0922/filesystem.git

git checkout -b SBC-7119S_filesystem-4.9.88

git push SBC-7119S_filesystem-4.9.88 SBC-7119S_filesystem-4.9.88


Examples:copy git commit git clone https://github.com/leelin0922/u-boot.git -b SBC-7112S_Linux_Uboot-v2017.03

git status

git add .

git commit

