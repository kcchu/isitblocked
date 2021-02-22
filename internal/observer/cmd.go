package observer

import (
	"github.com/spf13/cobra"
)

var out string

// Cmd is the probe subcommand.
var Cmd = &cobra.Command{
	Use:   "observer",
	Short: "Start observer",
	Run: func(cmd *cobra.Command, args []string) {
		Start()
	},
}
