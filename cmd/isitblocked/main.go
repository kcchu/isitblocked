package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/kcchu/isitblocked/internal/nexus"
	"github.com/kcchu/isitblocked/internal/probe"
	"github.com/kcchu/isitblocked/internal/observer"
)

func main() {
	rootCmd := &cobra.Command{
		Use: "isitblocked",
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Help()
			os.Exit(1)
		},
	}
	rootCmd.AddCommand(probe.Cmd)
	rootCmd.AddCommand(nexus.Cmd)
	rootCmd.AddCommand(observer.Cmd)
	err := rootCmd.Execute()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
