{ pkgs }: {
  deps = [
    pkgs.python39Full
    pkgs.sudo
    pkgs.nodejs-16_x
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}