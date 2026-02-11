{
  description = "Hype Commerce Swiss Tool - Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js 20 LTS
            nodejs_20
            # pnpm 9
            nodePackages.pnpm
            # PostgreSQL 16
            postgresql_16
            # Redis 7
            redis
            # Useful tools
            git
            curl
            jq
          ];

          shellHook = ''
            echo "🔧 Hype Commerce Dev Environment"
            echo "  Node.js: $(node --version)"
            echo "  pnpm:    $(pnpm --version)"
            echo "  PostgreSQL: $(postgres --version)"
            echo "  Redis:   $(redis-server --version)"
            echo ""
            echo "Run 'pnpm dev' to start development server"
          '';
        };
      }
    );
}
