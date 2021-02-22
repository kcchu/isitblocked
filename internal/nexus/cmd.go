package nexus

import (
	"github.com/spf13/cobra"
)

var out string

// Cmd is the probe subcommand.
var Cmd = &cobra.Command{
	Use:   "nexus",
	Short: "Start nexus",
	Run: func(cmd *cobra.Command, args []string) {
		Start()
	},
}
