package probe

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var out string

// Cmd is the probe subcommand.
var Cmd = &cobra.Command{
	Use:   "probe",
	Short: "Start probe or run a test",
	Run: func(cmd *cobra.Command, args []string) {
		Start()
	},
}

var testCmd = &cobra.Command{
	Use:   "test <url>...",
	Short: "test website connectivity",
	Args:  cobra.MinimumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		probe, err := New(Config{
			Submitter: &CliSubmitter{Out: out},
		})
		if err != nil {
			exitWithError(err)
		}
		probe.Measure("", "web_connectivity", args)
	},
}

func exitWithError(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}

func init() {
	testCmd.Flags().StringVarP(&out, "out", "o", "", "output file")
	Cmd.AddCommand(testCmd)
}
